
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/firebase";
import { useUserProfile } from "@/hooks/use-user-profile";
import { Trophy, Users, Crosshair, Play, Medal, Bomb, Flag, Sparkles, Brain, Puzzle, icons } from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

const TargetGame = () => {
    const { user } = useUser();
    const { userProfile, updateUserProfile } = useUserProfile(user?.uid);
    const [score, setScore] = useState(0);
    const [position, setPosition] = useState({ top: '50%', left: '50%' });
    const [gameStarted, setGameStarted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(15);
    const [gameOver, setGameOver] = useState(false);
    
    const highScore = userProfile?.points || 0;

    useEffect(() => {
        let gameTimer: NodeJS.Timeout;
        if (gameStarted && timeLeft > 0) {
            gameTimer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && gameStarted) {
            setGameStarted(false);
            setGameOver(true);
            if(userProfile && updateUserProfile && score > 0) {
                const newTotalPoints = (userProfile.points || 0) + score;
                 updateUserProfile({ points: newTotalPoints });
            }
        }
        return () => clearInterval(gameTimer);
    }, [gameStarted, timeLeft, score, userProfile, updateUserProfile]);

    const handleTargetClick = () => {
        if (timeLeft > 0 && gameStarted) {
            setScore(score + 10);
            moveTarget();
        }
    };

    const moveTarget = () => {
        const top = Math.random() * 85 + 5;
        const left = Math.random() * 85 + 5;
        setPosition({ top: `${top}%`, left: `${left}%` });
    };

    const startGame = () => {
        setScore(0);
        setTimeLeft(15);
        setGameStarted(true);
        setGameOver(false);
        moveTarget();
    };

    return (
        <Card className="shadow-lg h-full flex flex-col">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <Crosshair className="w-6 h-6 text-primary"/>
                    <div>
                        <CardTitle>Target Practice</CardTitle>
                        <CardDescription>Click the target as many times as you can in 15 seconds!</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex-1 relative bg-muted/30 rounded-lg m-6 mt-0">
                {!gameStarted && !gameOver ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center p-4">
                        <Button onClick={startGame} size="lg" disabled={!user}>
                            <Play className="mr-2 h-5 w-5"/>
                            Start Game
                        </Button>
                        {!user && <p className="text-sm text-muted-foreground">Sign in to play and save your score.</p>}
                    </div>
                ) : ( gameOver ? (
                     <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center p-4">
                        <p className="font-bold text-2xl text-primary">Final Score: {score}</p>
                        <Button onClick={startGame} size="lg" disabled={!user}>
                            <Play className="mr-2 h-5 w-5"/>
                            Play Again
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className="absolute top-2 left-2 text-lg font-bold">Score: {score}</div>
                        <div className="absolute top-2 right-2 text-lg font-bold">Time: {timeLeft}s</div>
                        <button
                            onClick={handleTargetClick}
                            className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-100 ease-out"
                            style={{ top: position.top, left: position.left }}
                        >
                            <Crosshair className="w-10 h-10 text-destructive animate-pulse" />
                        </button>
                    </>
                ))}
            </CardContent>
             <CardFooter>
                {userProfile && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Medal className="w-4 h-4 text-yellow-500" />
                        <span>High Score: {highScore}</span>
                    </div>
                )}
            </CardFooter>
        </Card>
    )
}

const ROWS = 5;
const COLS = 5;
const MINES = 3;

type Cell = {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  adjacentMines: number;
};

const MineGame = () => {
    const { user } = useUser();
    const { userProfile, updateUserProfile } = useUserProfile(user?.uid);
    const [grid, setGrid] = useState<Cell[][]>([]);
    const [gameOver, setGameOver] = useState(false);
    const [gameWon, setGameWon] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);

    const createGrid = useCallback(() => {
        let newGrid: Cell[][] = Array(ROWS).fill(null).map(() => 
            Array(COLS).fill(null).map(() => ({
                isMine: false,
                isRevealed: false,
                isFlagged: false,
                adjacentMines: 0,
            }))
        );

        // Place mines
        let minesPlaced = 0;
        while (minesPlaced < MINES) {
            const r = Math.floor(Math.random() * ROWS);
            const c = Math.floor(Math.random() * COLS);
            if (!newGrid[r][c].isMine) {
                newGrid[r][c].isMine = true;
                minesPlaced++;
            }
        }

        // Calculate adjacent mines
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                if (newGrid[r][c].isMine) continue;
                let count = 0;
                for (let i = -1; i <= 1; i++) {
                    for (let j = -1; j <= 1; j++) {
                        if (i === 0 && j === 0) continue;
                        const newR = r + i;
                        const newC = c + j;
                        if (newR >= 0 && newR < ROWS && newC >= 0 && newC < COLS && newGrid[newR][newC].isMine) {
                            count++;
                        }
                    }
                }
                newGrid[r][c].adjacentMines = count;
            }
        }
        return newGrid;
    }, []);

    const startGame = useCallback(() => {
        setGrid(createGrid());
        setGameOver(false);
        setGameWon(false);
        setGameStarted(true);
    }, [createGrid]);
    
    useEffect(() => {
        if (!gameStarted) {
            startGame();
        }
    }, [gameStarted, startGame]);


    const revealCell = (r: number, c: number) => {
        if (gameOver || grid[r][c].isRevealed || grid[r][c].isFlagged) return;

        let newGrid = [...grid.map(row => [...row])];
        newGrid[r][c].isRevealed = true;

        if (newGrid[r][c].isMine) {
            setGameOver(true);
            setGameWon(false);
            // Reveal all mines
            newGrid.forEach(row => row.forEach(cell => {
                if (cell.isMine) cell.isRevealed = true;
            }));
            setGrid(newGrid);
            return;
        }

        if (newGrid[r][c].adjacentMines === 0) {
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    const newR = r + i;
                    const newC = c + j;
                    if (newR >= 0 && newR < ROWS && newC >= 0 && newC < COLS && !newGrid[newR][newC].isRevealed) {
                        revealCell(newR, newC); // This is recursive, but state updates are tricky in React recursion
                    }
                }
            }
        }
        
        // This is a simplified reveal for adjacent cells on 0, not fully recursive to avoid complexity
        const revealQueue: [number, number][] = [[r, c]];
        while(revealQueue.length > 0) {
            const [row, col] = revealQueue.shift()!;
            if (newGrid[row][col].adjacentMines === 0) {
                 for (let i = -1; i <= 1; i++) {
                    for (let j = -1; j <= 1; j++) {
                        const newR = row + i;
                        const newC = col + j;
                         if (newR >= 0 && newR < ROWS && newC >= 0 && newC < COLS && !newGrid[newR][newC].isRevealed && !newGrid[newR][newC].isFlagged) {
                             newGrid[newR][newC].isRevealed = true;
                             if(newGrid[newR][newC].adjacentMines === 0) {
                                revealQueue.push([newR, newC]);
                             }
                        }
                    }
                }
            }
        }

        setGrid(newGrid);
        checkWinCondition(newGrid);
    };

    const flagCell = (e: React.MouseEvent, r: number, c: number) => {
        e.preventDefault();
        if (gameOver || grid[r][c].isRevealed) return;

        let newGrid = [...grid.map(row => [...row])];
        newGrid[r][c].isFlagged = !newGrid[r][c].isFlagged;
        setGrid(newGrid);
    };

    const checkWinCondition = (currentGrid: Cell[][]) => {
        const nonMineCells = currentGrid.flat().filter(cell => !cell.isMine);
        const allRevealed = nonMineCells.every(cell => cell.isRevealed);

        if (allRevealed) {
            setGameOver(true);
            setGameWon(true);
            if(userProfile && updateUserProfile) {
                const pointsWon = 50; // Award 50 points for winning
                const newTotalPoints = (userProfile.points || 0) + pointsWon;
                updateUserProfile({ points: newTotalPoints });
            }
        }
    };
    
    const renderCell = (cell: Cell, r: number, c: number) => {
        if (!cell.isRevealed) {
            return cell.isFlagged ? <Flag className="w-5 h-5 text-primary" /> : null;
        }
        if (cell.isMine) {
            return <Bomb className="w-5 h-5 text-destructive" />;
        }
        if (cell.adjacentMines > 0) {
            const colors = ['text-blue-500', 'text-green-500', 'text-red-500', 'text-blue-800', 'text-red-800'];
            return <span className={`font-bold ${colors[cell.adjacentMines - 1]}`}>{cell.adjacentMines}</span>;
        }
        return null;
    }


    return (
         <Card className="shadow-lg h-full flex flex-col">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <Bomb className="w-6 h-6 text-primary"/>
                    <div>
                        <CardTitle>Mine</CardTitle>
                        <CardDescription>Find all the squares without mines. Win 50 points!</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col items-center justify-center bg-muted/30 rounded-lg m-6 mt-0 p-4">
                 {!gameStarted ? (
                    <div className="flex flex-col items-center justify-center gap-4 text-center p-4">
                        <Button onClick={startGame} size="lg" disabled={!user}>
                            <Play className="mr-2 h-5 w-5"/>
                            Start Game
                        </Button>
                        {!user && <p className="text-sm text-muted-foreground">Sign in to play and save your score.</p>}
                    </div>
                ) : (
                <div className="space-y-4">
                     <div className="grid grid-cols-5 gap-1">
                        {grid.map((row, r) =>
                            row.map((cell, c) => (
                                <Button
                                    key={`${r}-${c}`}
                                    variant={cell.isRevealed ? "secondary" : "outline"}
                                    className={cn(
                                        "w-12 h-12 flex items-center justify-center text-xl font-bold",
                                        cell.isRevealed && "bg-background/50",
                                        gameOver && cell.isMine && "bg-destructive/20"
                                    )}
                                    onClick={() => revealCell(r, c)}
                                    onContextMenu={(e) => flagCell(e, r, c)}
                                    disabled={gameOver}
                                >
                                    {renderCell(cell, r, c)}
                                </Button>
                            ))
                        )}
                    </div>
                    {gameOver && (
                         <div className="text-center space-y-2">
                             {gameWon ? (
                                <p className="font-bold text-2xl text-green-500 flex items-center justify-center gap-2"><Sparkles/> You Won! +50 points!</p>
                             ) : (
                                <p className="font-bold text-2xl text-destructive">Game Over</p>
                             )}
                            <Button onClick={startGame} disabled={!user}>
                                <Play className="mr-2 h-5 w-5"/>
                                Play Again
                            </Button>
                        </div>
                    )}
                </div>
                )}
            </CardContent>
             <CardFooter>
                 {userProfile && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Trophy className="w-4 h-4 text-yellow-500" />
                        <span>Total Points: {(userProfile.points || 0).toLocaleString()}</span>
                    </div>
                )}
            </CardFooter>
        </Card>
    );
};

const iconNames = ["Cat", "Dog", "Fish", "Rabbit", "Turtle", "Bird", "Apple", "Banana"] as const;
const LucideIcons = iconNames.reduce((acc, name) => {
    const Icon = icons[name as keyof typeof icons];
    if (Icon) acc[name] = Icon;
    return acc;
}, {} as Record<typeof iconNames[number], React.FC<any>>);


type CardData = {
    id: number;
    icon: keyof typeof LucideIcons;
    isFlipped: boolean;
    isMatched: boolean;
};

const MemoryGame = () => {
    const { user } = useUser();
    const { userProfile, updateUserProfile } = useUserProfile(user?.uid);
    const [cards, setCards] = useState<CardData[]>([]);
    const [flippedCards, setFlippedCards] = useState<number[]>([]);
    const [moves, setMoves] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);

    const initializeGame = useCallback(() => {
        const gameIcons = [...iconNames, ...iconNames];
        const shuffledIcons = gameIcons.sort(() => Math.random() - 0.5);

        setCards(
            shuffledIcons.map((icon, index) => ({
                id: index,
                icon: icon,
                isFlipped: false,
                isMatched: false,
            }))
        );
        setMoves(0);
        setFlippedCards([]);
        setGameOver(false);
        setGameStarted(true);
    }, []);

    useEffect(() => {
        if (!gameStarted) {
            initializeGame();
        }
    }, [gameStarted, initializeGame]);

    useEffect(() => {
        if (flippedCards.length === 2) {
            const [firstId, secondId] = flippedCards;
            const firstCard = cards[firstId];
            const secondCard = cards[secondId];

            if (firstCard.icon === secondCard.icon) {
                // Match
                setCards(prev => prev.map(card => (card.icon === firstCard.icon ? { ...card, isMatched: true } : card)));
            }
            
            // Unflip cards after a delay
            setTimeout(() => {
                setFlippedCards([]);
            }, 1000);
        }
    }, [flippedCards, cards]);

    useEffect(() => {
        if (gameStarted && cards.length > 0 && cards.every(c => c.isMatched)) {
            setGameOver(true);
            if(userProfile && updateUserProfile) {
                const pointsWon = Math.max(100 - (moves - iconNames.length) * 5, 10); // Example scoring
                const newTotalPoints = (userProfile.points || 0) + pointsWon;
                updateUserProfile({ points: newTotalPoints });
            }
        }
    }, [cards, gameStarted, moves, userProfile, updateUserProfile]);


    const handleCardClick = (id: number) => {
        if (flippedCards.length === 2 || cards[id].isFlipped || cards[id].isMatched) return;

        setCards(prev => prev.map(card => (card.id === id ? { ...card, isFlipped: true } : card)));
        setFlippedCards(prev => [...prev, id]);
        
        if (flippedCards.length === 0) { // This is the first card of the turn
             setMoves(prev => prev + 1);
        }
    };
    
    return (
        <Card className="shadow-lg h-full flex flex-col col-span-1 lg:col-span-2">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <Brain className="w-6 h-6 text-primary"/>
                    <div>
                        <CardTitle>Memory Game</CardTitle>
                        <CardDescription>Find all matching pairs. The fewer moves, the more points you get!</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col items-center justify-center bg-muted/30 rounded-lg m-6 mt-0 p-4">
                 {!gameStarted ? (
                    <div className="flex flex-col items-center justify-center gap-4 text-center p-4">
                        <Button onClick={initializeGame} size="lg" disabled={!user}>
                            <Play className="mr-2 h-5 w-5"/>
                            Start Game
                        </Button>
                        {!user && <p className="text-sm text-muted-foreground">Sign in to play and earn points.</p>}
                    </div>
                ) : gameOver ? (
                     <div className="text-center space-y-2">
                         <p className="font-bold text-2xl text-green-500 flex items-center justify-center gap-2"><Sparkles/> You Won!</p>
                         <p className="text-muted-foreground">You found all pairs in {moves} moves.</p>
                        <Button onClick={initializeGame} disabled={!user}>
                            <Play className="mr-2 h-5 w-5"/>
                            Play Again
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-4">
                        <p className="font-bold">Moves: {moves}</p>
                        <div className="grid grid-cols-4 gap-2 md:gap-4">
                            {cards.map(card => {
                                const Icon = LucideIcons[card.icon];
                                return (
                                <button
                                    key={card.id}
                                    onClick={() => handleCardClick(card.id)}
                                    disabled={card.isFlipped || card.isMatched}
                                    className={cn(
                                        "w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-md transition-transform duration-300",
                                        "transform-style-3d",
                                        card.isFlipped || card.isMatched ? "bg-card rotate-y-180" : "bg-primary hover:bg-primary/90",
                                    )}
                                >
                                    <div className={cn("absolute backface-hidden", card.isFlipped || card.isMatched ? "hidden" : "block")}>
                                        <Puzzle className="w-6 h-6 text-primary-foreground" />
                                    </div>
                                    <div className={cn("absolute transform rotate-y-180 backface-hidden", card.isFlipped || card.isMatched ? "block" : "hidden")}>
                                        {Icon && <Icon className={cn("w-8 h-8", card.isMatched ? "text-green-500" : "text-primary")} />}
                                    </div>
                                </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </CardContent>
            <CardFooter>
                 {userProfile && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Trophy className="w-4 h-4 text-yellow-500" />
                        <span>Total Points: {(userProfile.points || 0).toLocaleString()}</span>
                    </div>
                )}
            </CardFooter>
            <style jsx>{`
                .transform-style-3d { transform-style: preserve-3d; }
                .rotate-y-180 { transform: rotateY(180deg); }
                .backface-hidden { backface-visibility: hidden; }
            `}</style>
        </Card>
    );
};


export default function GamesPage() {
  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold font-headline mb-2">Games</h1>
            <p className="text-muted-foreground">Play games to earn points and unlock more time with your AI companion.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MineGame />
            <TargetGame />
        </div>
        <div className="mt-6">
             <MemoryGame />
        </div>
    </div>
  );
}
