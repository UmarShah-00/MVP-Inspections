export default function RolesPage() {
    return (
        <div>
            <h1>Roles & Permissions</h1>

            <p style={{ marginTop: 12, color: "#64748B" }}>
                This MVP supports two roles at site level.
            </p>

            <div style={{ marginTop: 24 }}>
                <h3>Main Contractor</h3>
                <ul>
                    <li>Create & view all inspections</li>
                    <li>View all actions across subcontractors</li>
                    <li>Track site-wide compliance</li>
                </ul>

                <h3 style={{ marginTop: 24 }}>Subcontractor</h3>
                <ul>
                    <li>Create inspections</li>
                    <li>View own inspections</li>
                    <li>Close assigned actions</li>
                </ul>
            </div>
        </div>
    );
}
