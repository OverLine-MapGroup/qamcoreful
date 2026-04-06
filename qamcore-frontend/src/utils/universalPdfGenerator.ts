import jsPDF from "jspdf";

export interface TenantData {
  name: string;
  id: number;
  createdAt: string;
}

export interface StaffData {
  username: string;
  role: string;
}

export interface StudentData {
  displayName: string;
  riskLevel: string;
  riskScore: number;
  lastCheckInAt: string;
  hasSos: boolean;
}

export const generateTenantsPDF = (tenants: TenantData[], title: string = "Organizations Report") => {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  
  pdf.setFont("helvetica");
  
  // Заголовок
  pdf.setFontSize(16);
  pdf.text(title, 105, 20, { align: "center" });
  
  pdf.setFontSize(12);
  pdf.text(`Generation date: ${new Date().toLocaleDateString()}`, 105, 30, { align: "center" });
  pdf.text(`Total organizations: ${tenants.length}`, 105, 40, { align: "center" });
  
  // Разделитель
  pdf.line(20, 60, 190, 60);
  
  // Организации
  let yPosition = 70;
  tenants.forEach((tenant, index) => {
    if (yPosition > 270) {
      pdf.addPage();
      yPosition = 20;
    }
    
    pdf.setFontSize(12);
    pdf.text(`${index + 1}. Organization: ${tenant.name}`, 20, yPosition);
    
    pdf.setFontSize(10);
    pdf.text(`   ID: ${tenant.id}`, 20, yPosition + 5);
    pdf.text(`   Created: ${new Date(tenant.createdAt).toLocaleDateString()}`, 20, yPosition + 10);
    
    yPosition += 20;
  });
  
  const fileName = `organizations_${new Date().toISOString().split('T')[0]}.pdf`;
  pdf.save(fileName);
};

export const generateStaffPDF = (staff: StaffData[], organizationName: string, title: string = "Staff Report") => {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  
  pdf.setFont("helvetica");
  
  // Заголовок
  pdf.setFontSize(16);
  pdf.text(title, 105, 20, { align: "center" });
  
  pdf.setFontSize(12);
  pdf.text(`Organization: ${organizationName}`, 105, 30, { align: "center" });
  pdf.text(`Generation date: ${new Date().toLocaleDateString()}`, 105, 40, { align: "center" });
  pdf.text(`Total staff: ${staff.length}`, 105, 50, { align: "center" });
  
  // Разделитель
  pdf.line(20, 60, 190, 60);
  
  // Сотрудники
  let yPosition = 70;
  staff.forEach((member, index) => {
    if (yPosition > 270) {
      pdf.addPage();
      yPosition = 20;
    }
    
    pdf.setFontSize(12);
    pdf.text(`${index + 1}. Username: ${member.username}`, 20, yPosition);
    
    pdf.setFontSize(10);
    pdf.text(`   Role: ${member.role}`, 20, yPosition + 5);
    
    yPosition += 15;
  });
  
  const fileName = `staff_${organizationName}_${new Date().toISOString().split('T')[0]}.pdf`;
  pdf.save(fileName);
};

export const generateStudentsPDF = (students: StudentData[], title: string = "Students Report") => {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  
  pdf.setFont("helvetica");
  
  // Заголовок
  pdf.setFontSize(16);
  pdf.text(title, 105, 20, { align: "center" });
  
  pdf.setFontSize(12);
  pdf.text(`Generation date: ${new Date().toLocaleDateString()}`, 105, 30, { align: "center" });
  pdf.text(`Total students: ${students.length}`, 105, 40, { align: "center" });
  
  // Подсчет рисков
  const highRiskCount = students.filter(s => s.riskLevel === "HIGH" || s.riskLevel === "RED").length;
  const sosCount = students.filter(s => s.hasSos).length;
  
  pdf.setFontSize(10);
  pdf.text(`High risk students: ${highRiskCount}`, 105, 50, { align: "center" });
  pdf.text(`SOS alerts: ${sosCount}`, 105, 55, { align: "center" });
  
  // Разделитель
  pdf.line(20, 70, 190, 70);
  
  // Студенты
  let yPosition = 80;
  students.forEach((student, index) => {
    if (yPosition > 270) {
      pdf.addPage();
      yPosition = 20;
    }
    
    pdf.setFontSize(12);
    pdf.text(`${index + 1}. Student: ${student.displayName}`, 20, yPosition);
    
    pdf.setFontSize(10);
    
    // Цветовая индикация риска
    if (student.riskLevel === "HIGH" || student.riskLevel === "RED") {
      pdf.setTextColor(255, 0, 0);
    } else if (student.riskLevel === "MEDIUM") {
      pdf.setTextColor(255, 165, 0);
    } else if (student.riskLevel === "LOW") {
      pdf.setTextColor(0, 128, 0);
    } else {
      pdf.setTextColor(0, 0, 0);
    }
    
    pdf.text(`   Risk Level: ${student.riskLevel}`, 20, yPosition + 5);
    pdf.text(`   Risk Score: ${student.riskScore}`, 20, yPosition + 10);
    
    if (student.hasSos) {
      pdf.setTextColor(255, 0, 0);
      pdf.text(`   ⚠️ SOS ALERT`, 20, yPosition + 15);
    }
    
    pdf.setTextColor(0, 0, 0);
    pdf.text(`   Last Check-in: ${student.lastCheckInAt ? new Date(student.lastCheckInAt).toLocaleDateString() : "No data"}`, 20, yPosition + 20);
    
    yPosition += 30;
  });
  
  const fileName = `students_${new Date().toISOString().split('T')[0]}.pdf`;
  pdf.save(fileName);
};
