'use client';
import styles from '../page.module.css'
import Button from '../button'
import ProductList from './productList'


export default function MyName() {
    return (
        <div className={styles.main}>
            <ProductList/>
        </div>
    )
}