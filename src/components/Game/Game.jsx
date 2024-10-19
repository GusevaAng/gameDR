import React, { useCallback, useEffect, useRef, useState } from 'react'
import './Game.css'
import { labyrinth1 } from '../labyrinth'
import { labyrinth2 } from '../labyrinth'
import { labyrinth3 } from '../labyrinth'
import { labyrinth4 } from '../labyrinth'
import { Link } from 'react-router-dom'


const Game = () => {

    const allLabyrinths = [labyrinth1, labyrinth2, labyrinth3, labyrinth4]
    const [currentLevel, setCurrentLevel] = useState(0)
    const currentLabyrinth = allLabyrinths[currentLevel]
    console.log('currentLevel', currentLevel)

    const [currentPosition, setCurrentPosition] = useState(currentLabyrinth.initialPosition)
    const [ isWin, setIsWin ] = useState(false)

    const isValidMove = (position) => {
        return (
            position.y >= 0 && position.y < currentLabyrinth.labyrinth.length &&
            position.x >= 0 && position.x < currentLabyrinth.labyrinth[0].length &&
            currentLabyrinth.labyrinth[position.y][position.x] !== 1
        )
    }

    const currentPositionRef = useRef(currentPosition)

    useEffect(() => {
        currentPositionRef.current = currentPosition
    }, [currentPosition])

    const movePlayer = useCallback((dx, dy) => {

        if (isWin) return

        const { player, box } = currentPositionRef.current
        const newPlayerPosition = { x: player.x + dx, y: player.y + dy } 

        if (isValidMove(newPlayerPosition)) {
            if(newPlayerPosition.x === box.x && newPlayerPosition.y === box.y) {
                const newBoxPosition = { x: box.x + dx, y: box.y + dy }

                if(isValidMove(newBoxPosition)) {
                    setCurrentPosition(prev => ({
                        player: newPlayerPosition,
                        box: newBoxPosition
                    }))

                    if (newBoxPosition.x === currentLabyrinth.exit.x && newBoxPosition.y === currentLabyrinth.exit.y) {
                        setIsWin(true)
                    }
                }
            
            } else {
                setCurrentPosition(prev => ({
                    ...prev,
                    player: newPlayerPosition
                }))
            }
        }
    }, [isWin])

    useEffect(() => {
        const handleKey = (event) => {
            switch (event.key) {
                case 'ArrowUp':
                    movePlayer(0, -1)
                    break
                case 'ArrowDown':
                    movePlayer(0, 1)
                    break
                case 'ArrowLeft':
                    movePlayer(-1, 0)
                    break
                case 'ArrowRight':
                    movePlayer(1, 0)
                    break
                default:
                    break
            }
        }

        window.addEventListener('keydown', handleKey)

        return () => {
            window.removeEventListener('keydown', handleKey)
        }
    }, [movePlayer])


    const labyrinthVisualization = currentLabyrinth.labyrinth.map((row, y) => (
        <div key={y} className='row'>
            {row.map((cell, x) => {
                let style = ''
                if (cell === 1) {
                    style = 'wall'
                } else {
                    style = 'path'
                }

                if (x === currentLabyrinth.exit.x && y === currentLabyrinth.exit.y) {
                    style = 'exit'
                }
                
                if (currentPosition.player.x === x && currentPosition.player.y === y) {
                    style = 'player'
                } else if (currentPosition.box.x === x && currentPosition.box.y === y) {
                    style = 'box'
                }
                return <div key={x} className={`cell ${style}`}>  </div>
            })}
        </div>
    ))

    const handleReset = () => {
        setCurrentPosition(currentLabyrinth.initialPosition) 
    }


    const nextLevel = () => {
        setCurrentLevel(currentLevel + 1)
        setIsWin(false)
        setCurrentPosition(currentLabyrinth.initialPosition)        
    }
    

    return (
        <div className='container'>
            {labyrinthVisualization}
            {isWin && currentLevel < 3 && (
                <div className='modal'>
                    <div className='modal-content'>
                        <p className='winer'> Поздравляем с победой! </p>
                        <p className='winer'> Но это еще не всё </p>
                        <button onClick={nextLevel} className='button_win'> ок </button>
                    </div>
                </div>
            )}
            <button onClick={handleReset} className='button_start_over'> Начать сначала </button>
            {isWin && currentLevel === 3 && (
                <div className='next'>
                    <Link to={'/Sutton'} className='next_link'> next </Link>
                </div>
            )}
        </div>
    )
}

export default Game