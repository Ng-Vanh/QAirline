import React from "react";

const styles = {
    tableWrapper: {
        position: "relative",
        width: "100%",
        overflow: "auto",
    },
    table: {
        width: "100%",
        fontSize: "0.875rem", // text-sm
        borderCollapse: "collapse",
    },
    headerRow: {
        borderBottom: "1px solid #e5e7eb", // &_tr]:border-b
    },
    bodyRow: {
        borderBottom: "1px solid #e5e7eb",
        transition: "background-color 0.2s ease", // hover:bg-muted/50
    },
    bodyRowLast: {
        borderBottom: "none", // [&_tr:last-child]:border-0
    },
    footer: {
        borderTop: "1px solid #e5e7eb", // border-t
        backgroundColor: "#f3f4f6", // bg-muted/50
        fontWeight: "500", // font-medium
    },
    rowHover: {
        backgroundColor: "#f3f4f6", // hover:bg-muted/50
    },
    selectedRow: {
        backgroundColor: "#e5e7eb", // data-[state=selected]:bg-muted
    },
    headCell: {
        height: "2.5rem", // h-10
        padding: "0 0.5rem", // px-2
        textAlign: "left", // text-left
        verticalAlign: "middle", // align-middle
        fontWeight: "500", // font-medium
        color: "#6b7280", // text-muted-foreground
    },
    cell: {
        padding: "0.5rem", // p-2
        verticalAlign: "middle", // align-middle
    },
    caption: {
        marginTop: "1rem", // mt-4
        fontSize: "0.875rem", // text-sm
        color: "#6b7280", // text-muted-foreground
    },
};

const Table = React.forwardRef(({ className, ...props }, ref) => (
    <div style={styles.tableWrapper}>
        <table ref={ref} style={styles.table} {...props} />
    </div>
));
Table.displayName = "Table";

const TableHeader = React.forwardRef(({ className, ...props }, ref) => (
    <thead ref={ref} style={styles.headerRow} {...props} />
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef(({ className, ...props }, ref) => (
    <tbody ref={ref} {...props} />
));
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef(({ className, ...props }, ref) => (
    <tfoot ref={ref} style={styles.footer} {...props} />
));
TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef(({ className, ...props }, ref) => (
    <tr
        ref={ref}
        style={styles.bodyRow}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = styles.rowHover.backgroundColor)}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
        {...props}
    />
));
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef(({ className, ...props }, ref) => (
    <th ref={ref} style={styles.headCell} {...props} />
));
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef(({ className, ...props }, ref) => (
    <td ref={ref} style={styles.cell} {...props} />
));
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef(({ className, ...props }, ref) => (
    <caption ref={ref} style={styles.caption} {...props} />
));
TableCaption.displayName = "TableCaption";

export {
    Table,
    TableHeader,
    TableBody,
    TableFooter,
    TableHead,
    TableRow,
    TableCell,
    TableCaption,
};
