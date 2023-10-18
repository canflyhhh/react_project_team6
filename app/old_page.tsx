import styles from './page.module.css'
import List from './list'
export default function Home(){
    return (<div className={styles.main}><List/><h2>Hello </h2></div>)
}