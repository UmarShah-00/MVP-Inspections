import styles from "@/styles/dashboard.module.css";

interface Props {
    data: {
        _id: string;
        title: string;
        status: string;
        category: string;
        subcontractor: string;
        createdAt: string;
    }[];
}

export default function RecentInspectionsTable({ data }: Props) {
    if (!data || data.length === 0) {
        return <p style={{ padding: "20px" }}>No inspections found.</p>;
    }

    return (
        <div style={{ overflowX: "auto" }}>
            <div className={styles.table}>
                {/* Header */}
                <div className={styles.header}>
                    <div>#</div> 
                    <div>Title</div>
                    <div>Status</div>
                    <div>Category</div>
                    <div>Assigned To</div>
                    <div>Date</div>
                </div>

                {/* Rows */}
                {data.map((d, index) => (
                    <div key={d._id} className={styles.row}>
                        <div>{index + 1}</div>
                        <div>{d.title}</div>
                        <div>
                            <span
                                className={`${styles.statusBadge} ${
                                    d.status === "Draft"
                                        ? styles.statusDraft
                                        : styles.statusSubmitted
                                }`}
                            >
                                {d.status}
                            </span>
                        </div>
                        <div>{d.category}</div>
                        <div>{d.subcontractor}</div>
                        <div className={styles.dateCell}>
                            {new Date(d.createdAt).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
