import * as XLSX from "xlsx";
import type { TableData } from "~/types/ai";

export function exportToExcel(data: TableData, filename: string = "table-data") {
  if (!data.headers.length && !data.rows.length) {
    throw new Error("No data to export");
  }

  const worksheet = XLSX.utils.aoa_to_sheet([
    data.headers,
    ...data.rows
  ]);

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array"
  });

  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}.xlsx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportToCSV(data: TableData, filename: string = "table-data") {
  if (!data.headers.length && !data.rows.length) {
    throw new Error("No data to export");
  }

  const csvContent = [
    data.headers.join(","),
    ...data.rows.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(","))
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}