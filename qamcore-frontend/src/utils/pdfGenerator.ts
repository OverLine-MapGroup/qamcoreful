import jsPDF from "jspdf";

export interface CodeData {
  code?: string;
  value?: string;
  inviteCode?: string;
  createdAt?: string;
  created_at?: string;
  date?: string;
  used?: boolean;
  is_used?: boolean;
  used_at?: any;
}

export const generateCodesPDF = (codes: any[], groupName: string, title: string = "Codes of invitation") => {
  console.log("PDF generation - codes data:", codes);
  console.log("PDF generation - first code:", codes[0]);
  console.log("PDF generation - code type:", typeof codes[0]);
  
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  
  // Настройки шрифта и стилей
  pdf.setFont("helvetica");
  
  // Заголовок
  pdf.setFontSize(16);
  pdf.text(title, 105, 20, { align: "center" });
  
  pdf.setFontSize(12);
  pdf.text(`Group: ${groupName}`, 105, 30, { align: "center" });
  pdf.text(`Generation date: ${new Date().toLocaleDateString()}`, 105, 40, { align: "center" });
  
  pdf.setFontSize(10);
  pdf.text(`Total codes: ${codes.length}`, 105, 50, { align: "center" });
  
  // Разделитель
  pdf.line(20, 60, 190, 60);
  
  // Коды
  let yPosition = 70;
  codes.forEach((code, index) => {
    if (yPosition > 270) {
      pdf.addPage();
      yPosition = 20;
    }
    
    pdf.setFontSize(12);
    let codeValue = '';
    
    // Обработка разных форматов кодов
    if (typeof code === 'string') {
      codeValue = code;
    } else if (typeof code === 'object' && code !== null) {
      codeValue = code.code || code.value || code.inviteCode || `CODE_${index + 1}`;
    } else {
      codeValue = `CODE_${index + 1}`;
    }
    
    pdf.text(`${index + 1}. Code: ${codeValue}`, 20, yPosition);
    
    pdf.setFontSize(10);
    let createdAt = new Date().toLocaleDateString(); // Используем текущую дату
    
    // Обработка даты для разных форматов
    if (typeof code === 'object' && code !== null) {
      createdAt = code.createdAt ? new Date(code.createdAt).toLocaleDateString() : 
                 code.created_at ? new Date(code.created_at).toLocaleDateString() :
                 code.date ? new Date(code.date).toLocaleDateString() : 
                 new Date().toLocaleDateString(); // Fallback на текущую дату
    }
    
    pdf.text(`   Created: ${createdAt}`, 20, yPosition + 5);
    
    // Обработка статуса для разных форматов
    let isUsed = false;
    if (typeof code === 'object' && code !== null) {
      isUsed = code.used || code.is_used || code.used_at || false;
    }
    
    if (isUsed) {
      pdf.setTextColor(255, 0, 0);
      pdf.text(`   Status: USED`, 20, yPosition + 10);
      pdf.setTextColor(0, 0, 0);
    } else {
      pdf.setTextColor(0, 128, 0);
      pdf.text(`   Status: ACTIVE`, 20, yPosition + 10);
      pdf.setTextColor(0, 0, 0);
    }
    
    yPosition += 20;
  });
  
  // Сохранение файла
  const fileName = `${title.toLowerCase().replace(/\s+/g, '_')}_${groupName}_${new Date().toISOString().split('T')[0]}.pdf`;
  pdf.save(fileName);
};
