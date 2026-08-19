import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Estilos usando Flexbox (similar a React Native o Tailwind)
const styles = StyleSheet.create({
  page: { padding: 40, backgroundColor: '#FFFFFF', fontFamily: 'Helvetica' },
  header: { marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#E5E7EB', paddingBottom: 10 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#111827' },
  subtitle: { fontSize: 12, color: '#6B7280', marginTop: 4 },
  table: { display: 'flex', width: 'auto', borderStyle: 'solid', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 4, marginTop: 10 },
  tableRowHeader: { flexDirection: 'row', backgroundColor: '#F9FAFB', borderBottomWidth: 1, borderBottomColor: '#E5E7EB', fontWeight: 'bold' },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  tableCol: { width: '25%', padding: 8, borderRightWidth: 1, borderRightColor: '#E5E7EB' },
  tableColLast: { width: '25%', padding: 8 },
  tableCellHeader: { fontSize: 10, color: '#374151', fontWeight: 'bold' },
  tableCell: { fontSize: 10, color: '#111827' },
  footer: { position: 'absolute', bottom: 30, left: 40, right: 40, textAlign: 'center', color: '#9CA3AF', fontSize: 10 }
});

export default function ReporteBasePDF({ titulo, rangoFechas, datos }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* Encabezado del Documento */}
        <View style={styles.header}>
          <Text style={styles.title}>{titulo}</Text>
          <Text style={styles.subtitle}>Generado para el período: {rangoFechas}</Text>
        </View>

        {/* Ejemplo de Tabla (Adaptable según los datos que le pases) */}
        <View style={styles.table}>
          <View style={styles.tableRowHeader}>
            <View style={styles.tableCol}><Text style={styles.tableCellHeader}>Fecha</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCellHeader}>Concepto / Entidad</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCellHeader}>Categoría / Tipo</Text></View>
            <View style={styles.tableColLast}><Text style={styles.tableCellHeader}>Valor</Text></View>
          </View>

          {/* Mapeo dinámico de los datos recibidos del backend */}
          {datos && datos.map((item, index) => (
            <View style={styles.tableRow} key={index}>
              {/* Ajusta estas propiedades según la estructura de tu JSON (Finanzas, Salud, etc.) */}
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.fecha || item.fecha_pago || "-"}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.concepto || item.nombre || item.codigo || "-"}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.categoria || item.tipo || "-"}</Text>
              </View>
              <View style={styles.tableColLast}>
                <Text style={styles.tableCell}>{item.monto ? `$${item.monto}` : item.cantidad || "-"}</Text>
              </View>
            </View>
          ))}
        </View>

        <Text style={styles.footer} render={({ pageNumber, totalPages }) => (
          `AgroTrack - Página ${pageNumber} de ${totalPages}`
        )} fixed />
      </Page>
    </Document>
  );
}