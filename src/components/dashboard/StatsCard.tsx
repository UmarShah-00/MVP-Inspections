import styles from "./Dashboard.module.css";

interface Props {
  title: string;
  value: string;
  warning?: boolean;
  success?: boolean;
}

export default function StatsCard({ title, value, warning, success }: Props) {
  return (
    <div
      className={`${styles.card} ${
        warning ? styles.warning : success ? styles.success : ""
      }`}
    >
      <p>{title}</p>
      <h2>{value}</h2>
    </div>
  );
}
