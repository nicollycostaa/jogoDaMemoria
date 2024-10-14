"use client";

import { useState, useEffect } from 'react';
import './globals.css';

const images = [
    { id: 1, src: 'https://via.placeholder.com/150/FF5733/FFFFFF?text=1' },
    { id: 2, src: 'https://via.placeholder.com/150/33FF57/FFFFFF?text=2' },
    { id: 3, src: 'https://via.placeholder.com/150/3357FF/FFFFFF?text=3' },
    { id: 4, src: 'https://via.placeholder.com/150/FF33A1/FFFFFF?text=4' },
    { id: 5, src: 'https://via.placeholder.com/150/FFFF33/FFFFFF?text=5' },
    { id: 6, src: 'https://via.placeholder.com/150/33FFFF/FFFFFF?text=6' },
];

function shuffle(array: any[]) {
    return array.sort(() => Math.random() - 0.5);
}

export default function Home() {
    const [cards, setCards] = useState<any[]>([]);
    const [flippedCards, setFlippedCards] = useState<number[]>([]);
    const [matchedCards, setMatchedCards] = useState<number[]>([]);
    const [moves, setMoves] = useState(0);
    const [isChecking, setIsChecking] = useState(false);

    useEffect(() => {
        const cardArray = [...images, ...images].map(image => ({ ...image, isFlipped: false }));
        setCards(shuffle(cardArray));
    }, []);

    const flipCard = (id: number) => {
        if (!isChecking && !flippedCards.includes(id) && !matchedCards.includes(id)) {
            setFlippedCards(prev => [...prev, id]);
            setMoves(prev => prev + 1);
        }
    };

    useEffect(() => {
        if (flippedCards.length === 2) {
            setIsChecking(true);

            const firstCard = cards.find(card => card.id === flippedCards[0]);
            const secondCard = cards.find(card => card.id === flippedCards[1]);

            if (firstCard.src === secondCard.src) {
                setMatchedCards(prev => [...prev, firstCard.id, secondCard.id]);
            }

            // Espera um tempo antes de desvirar as cartas
            const timeout = setTimeout(() => {
                if (matchedCards.length + 2 === cards.length) {
                    alert("Você ganhou!"); // Alerta quando todos os pares forem encontrados
                    resetGame(); // Reinicia o jogo
                }
                setFlippedCards([]);
                setIsChecking(false);
            }, 1000);

            return () => clearTimeout(timeout);
        }
    }, [flippedCards, cards, matchedCards]);

    const resetGame = () => {
        const cardArray = [...images, ...images].map(image => ({ ...image, isFlipped: false }));
        setCards(shuffle(cardArray));
        setMatchedCards([]);
        setMoves(0);
        setFlippedCards([]);
    };

    return (
        <div className="container">
            <h1>Jogo da Memória</h1>
            <h2>Movimentos: {moves}</h2>
            <div className="grid">
                {cards.map(card => (
                    <div key={card.id} className="card" onClick={() => flipCard(card.id)}>
                        {flippedCards.includes(card.id) || matchedCards.includes(card.id) ? (
                            <img src={card.src} alt="Card Image" />
                        ) : (
                            <div className="card-back">?</div>
                        )}
                    </div>
                ))}
            </div>
            <button onClick={resetGame} className="reset-button">Reiniciar Jogo</button>
        </div>
    );
}
