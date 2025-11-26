"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/firebase";
import { useUserProfile } from "@/hooks/use-user-profile";
import { Trophy, Users, Crosshair, Play, Medal } from "lucide-react";
import React, { useState, useEffect } from "react";

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
                {!gameStarted ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center p-4">
                        {gameOver && <p className="font-bold text-2xl text-primary">Final Score: {score}</p>}
                        {userProfile && (
                            <div className="flex items-center gap-2 text-lg">
                                <Medal className="w-6 h-6 text-yellow-500" />
                                <span>High Score: {highScore}</span>
                            </div>
                        )}
                        <Button onClick={startGame} size="lg" disabled={!user}>
                            <Play className="mr-2 h-5 w-5"/>
                            {gameOver ? "Play Again" : "Start Game"}
                        </Button>
                        {!user && <p className="text-sm text-muted-foreground">Sign in to play and save your score.</p>}
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
                )}
            </CardContent>
        </Card>
    )
}


export default function GamesPage() {
  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold font-headline mb-2">Games</h1>
            <p className="text-muted-foreground">Play games to earn points and unlock more time with your AI companion.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                <TargetGame />
            </div>

            <div className="space-y-6">
                <Card className="shadow-lg hover:shadow-primary/20 transition-shadow">
                    <CardHeader className="flex flex-row items-center gap-4">
                        <Trophy className="w-8 h-8 text-yellow-500" />
                        <div>
                            <CardTitle>Simple Games</CardTitle>
                            <CardDescription>Play fun games to earn points.</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Button className="w-full">View Games</Button>
                    </CardContent>
                </Card>

                <Card className="shadow-lg hover:shadow-accent/20 transition-shadow">
                    <CardHeader className="flex flex-row items-center gap-4">
                        <Users className="w-8 h-8 text-accent" />
                        <div>
                            <CardTitle>Two-Player Games</CardTitle>
                            <CardDescription>Challenge a friend for double points.</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Button variant="secondary" className="w-full">Find Opponent</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}
