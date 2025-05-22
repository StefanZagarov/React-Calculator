import styles from './CalcScreen.module.css';

interface CalcScreenProps {
  input: string;
  result: string;
}

export default function CalcScreen({ input, result }: CalcScreenProps) {


  return (
    <>
      <div className={styles["screen"]}>
        <p className={styles["input"]}>{input}</p>
        <p className={styles["result"]}>{result}</p>
      </div>
    </>
  );
}