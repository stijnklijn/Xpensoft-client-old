import React, {useContext} from 'react';
import styles from './BarChart.module.css'
import Context from '../../store/context'

export function BarChart({calculate, showCorrectHeader, showEmpty}) {

    const context = useContext(Context);

    let [headers, total] = calculate();

    if (!showEmpty) {
        for (let header in headers) {
            if (headers[header] === 0) {
                delete headers[header];
            }
        }
    }
 
    let numberOfBars = Object.keys(headers).length
    let longestBar = Math.max(...Object.values(headers))
    headers = (Object.entries(headers).sort((a, b) => {
        if (showCorrectHeader(Number(a[0])) > showCorrectHeader(Number(b[0]))) {
            return 1;
        }
        else {
            return -1;
        }
    }))
    
    let bars = [];
    let ticks = [];

    for (let i = 0; i < numberOfBars; i++) {
        let x = i * (100 / numberOfBars);
        let y = 100 - headers[i][1] / longestBar * 100;
        let width = 100 / numberOfBars;
        let height = headers[i][1] / longestBar * 100;
        let color = `hsl(${i * 360 / numberOfBars}, 100%, 50%)`
        let percentage = headers[i][1] / total * 100;
        bars.push([x, y, width, height, showCorrectHeader(Number(headers[i][0])), color, percentage]);
    }

    for (let i = 0; i <= 20; i++) {
        let y = i * 25;
        let number = (longestBar - i * (longestBar / 20)).toFixed(0);
        ticks.push([y, number]);
    }

    if (total === 0) {
        return <p className={styles['no-data']}>{context.lang === 'en' ? 'No data for this period' : 'Geen gegevens voor deze periode'}</p>
    }
    
    return(
        <div className={styles['bar-chart']}>
            <svg className={styles.svg} xmlns="http://www.w3.org/2000/svg" viewBox='0 0 50 500' width='50' height='500'>
                {ticks.map((tick, i) => {
                    return(
                        i !== 0 && i !== ticks.length - 1 && <g key={i}>
                            <text x='5' y={tick[0] + 4} fontSize='12'>{tick[1]}</text>
                            <line x1='30' y1={tick[0]} x2='45' y2={tick[0]} stroke='black'/>

                        </g>
                    );
                })}

            </svg>
            <svg className={styles.svg} xmlns="http://www.w3.org/2000/svg" viewBox='0 0 100 100' width='500' height='500'>
                {bars.map((bar, i) => {
                    return (
                        <rect key={i} x={bar[0]} y={bar[1]} width={bar[2]} height={bar[3]} stroke='black' strokeWidth='0.25' fill={bar[5]}/>
                    );
                })}
            </svg>
            <svg className={styles.svg} xmlns="http://www.w3.org/2000/svg" viewBox='0 0 100 100' width='500' height='500' >
                {bars.map((bar, i) => {
                    return (
                        <g key={i}>
                            <rect x='4' y={i * 5 + 2} width='4' height='4' stroke='black' strokeWidth='0.5' fill={bar[5]}/>
                            <text x='9' y={i * 5 + 5} fontSize='4'>{bar[4] + ' (' + bar[6].toFixed() + '%)'}</text>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
  }