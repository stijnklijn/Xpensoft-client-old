import React, {useContext} from 'react';
import styles from './PieChart.module.css';
import Context from '../../store/context';

export function PieChart({calculate, showCorrectHeader, showEmpty}) {

    const context = useContext(Context);

    let [headers, total] = calculate();

    if (!showEmpty) {
        for (let header in headers) {
            if (headers[header] === 0) {
                delete headers[header];
            }
        }
    }

    headers = (Object.entries(headers).sort((a, b) => {
        if (showCorrectHeader(Number(a[0])) > showCorrectHeader(Number(b[0]))) {
            return 1;
        }
        else {
            return -1;
        }
    }))
    let subTotal = 0;
    let slices = [];

    for (let i = 0; i < headers.length; i++) {
        let startX = 100 * Math.cos(2 * Math.PI * (subTotal / total))
        let startY = 100 * Math.sin(2 * Math.PI * (subTotal / total))
        let moreThanHalf = headers[i][1] < total / 2 ? 0 : 1
        subTotal += headers[i][1];
        let endX = 100 * Math.cos(2 * Math.PI * (subTotal / total))
        let endY = 100 * Math.sin(2 * Math.PI * (subTotal / total))
        let color = `hsl(${i * 360 / headers.length}, 100%, 50%)`
        let percentage = headers[i][1] / total * 100;
        slices.push([startX, startY, moreThanHalf, endX, endY, color, showCorrectHeader(Number(headers[i][0])), percentage])
    }

    if (total === 0) {
        return <p className={styles['no-data']}>{context.lang === 'en' ? 'No data for this period' : 'Geen gegevens voor deze periode'}</p>
    }
    
    return(
        <div className={styles['pie-chart']}>
                <svg className={styles.svg} xmlns="http://www.w3.org/2000/svg" viewBox='-100 -100 200 200' width='500' height='500' transform='rotate(-90)'>
                {slices.map((slice, i) => {
                return <path key={i} d={'M 0 0 L ' + slice[0] + ' ' + slice[1] + ' A 100 100 0 ' + slice[2] + ' 1 ' + slice[3] + ' ' + slice[4] + ' Z'} stroke='black' strokeWidth='0.25' fill={slice[5]}/>
                })}
                </svg>
                <svg className={styles.svg} xmlns="http://www.w3.org/2000/svg" viewBox='0 0 100 100' width='500' height='500' >
                    {slices.map((slice, i) => {
                        return (
                            <g key={i}>
                                <rect x='4' y={i * 5 + 2} width='4' height='4' stroke='black' strokeWidth='0.5' fill={slice[5]}/>
                                <text x='9' y={i * 5 + 5} fontSize='4'>{slice[6] + ' (' + slice[7].toFixed() + '%)'}</text>
                            </g>
                        );
                    })}
                </svg>
            </div>
    );
}