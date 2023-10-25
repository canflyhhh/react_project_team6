'use client';
import styles from './page.module.css'
import Sort from '../sort/sort'

export default function Home() {
    return (
        <div className={styles.main}>
            <Sort/>
        </div>
    )
}