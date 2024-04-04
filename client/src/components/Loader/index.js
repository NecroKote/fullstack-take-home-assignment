import styles from "./Loader.module.css";

export const Loader = () => <div className={styles.loaderContainer}>
  <div className={styles.loader} />
</div>

export const PlaceholderLoader = ({ isLoading }) => {
  return (
    <div className={styles.loaderContainer}>
      {isLoading && <div className={styles.loader} />}
    </div>
  )
}

export default Loader;