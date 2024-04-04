import styles from "./Button.module.css";

export const Button = (props) => {
  const { children, onClick, disabled, kind } = props;

  return (
    <button
      type="button"
      className={`${styles.button} ${styles[kind]}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

export const DeleteButton = (props) => (
  <Button {...props} kind="delete">
    <svg width="24" height="24" viewBox="0 0 490 490" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <g>
        <path d="M102.492,490h285.016c30.132,0,54.641-24.509,54.641-54.625V94.97h32.539V49.033H337.544V0H152.455v49.033H15.313V94.97   h32.539v340.404C47.852,465.491,72.36,490,102.492,490z M396.211,435.375c0,4.71-3.993,8.688-8.703,8.688H102.492   c-4.71,0-8.703-3.978-8.703-8.688V94.97h302.422V435.375z" />
        <rect x="150.568" y="171.234" width="45.938" height="191.406" />
        <rect x="229.688" y="171.234" width="45.938" height="191.406" />
        <rect x="308.807" y="171.234" width="45.938" height="191.406" />
      </g>
    </svg>
  </Button>
)

export const AddButton = (props) => (
  <Button {...props} kind="add">
    <svg width="24" height="24" viewBox="-3 0 50 40" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M41.267,18.557H26.832V4.134C26.832,1.851,24.99,0,22.707,0c-2.283,0-4.124,1.851-4.124,4.135v14.432H4.141   c-2.283,0-4.139,1.851-4.138,4.135c-0.001,1.141,0.46,2.187,1.207,2.934c0.748,0.749,1.78,1.222,2.92,1.222h14.453V41.27   c0,1.142,0.453,2.176,1.201,2.922c0.748,0.748,1.777,1.211,2.919,1.211c2.282,0,4.129-1.851,4.129-4.133V26.857h14.435   c2.283,0,4.134-1.867,4.133-4.15C45.399,20.425,43.548,18.557,41.267,18.557z" />
    </svg>
  </Button>
)

export default Button;
