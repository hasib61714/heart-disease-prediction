from reportlab.lib.pagesizes import letter, A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, Image
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
from datetime import datetime
import io

def generate_patient_report(patient_data):
    """Generate a PDF report for a patient"""
    
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4, 
                          rightMargin=72, leftMargin=72,
                          topMargin=72, bottomMargin=18)
    
    # Container for the 'Flowable' objects
    elements = []
    
    # Define styles
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        textColor=colors.HexColor('#1e40af'),
        spaceAfter=30,
        alignment=TA_CENTER,
        fontName='Helvetica-Bold'
    )
    
    heading_style = ParagraphStyle(
        'CustomHeading',
        parent=styles['Heading2'],
        fontSize=16,
        textColor=colors.HexColor('#1e40af'),
        spaceAfter=12,
        spaceBefore=12,
        fontName='Helvetica-Bold'
    )
    
    normal_style = ParagraphStyle(
        'CustomNormal',
        parent=styles['Normal'],
        fontSize=11,
        spaceAfter=6,
        alignment=TA_LEFT
    )
    
    # Title
    title = Paragraph("Heart Disease Prediction Report", title_style)
    elements.append(title)
    elements.append(Spacer(1, 0.2*inch))
    
    # Report metadata
    report_date = datetime.now().strftime('%B %d, %Y at %I:%M %p')
    date_text = Paragraph(f"<b>Report Generated:</b> {report_date}", normal_style)
    elements.append(date_text)
    elements.append(Spacer(1, 0.3*inch))
    
    # Patient Information
    patient_heading = Paragraph("Patient Information", heading_style)
    elements.append(patient_heading)
    
    patient_info = [
        ['Patient Name:', patient_data['name']],
        ['Patient ID:', str(patient_data['id'])],
        ['Age:', f"{patient_data['age']} years"],
        ['Gender:', patient_data['sex']],
        ['Date of Assessment:', patient_data['created_at']],
    ]
    
    patient_table = Table(patient_info, colWidths=[2.5*inch, 4*inch])
    patient_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#e0e7ff')),
        ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTNAME', (1, 0), (1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 11),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
    ]))
    
    elements.append(patient_table)
    elements.append(Spacer(1, 0.3*inch))
    
    # Medical Parameters
    medical_heading = Paragraph("Medical Parameters", heading_style)
    elements.append(medical_heading)
    
    medical_data = [
        ['Parameter', 'Value', 'Reference Range'],
        ['Chest Pain Type (CP)', str(patient_data['cp']), '0-3 (Type indicator)'],
        ['Resting Blood Pressure', f"{patient_data['trestbps']} mm Hg", '90-140 mm Hg'],
        ['Cholesterol', f"{patient_data['chol']} mg/dl", '< 200 mg/dl'],
        ['Fasting Blood Sugar', 'Yes' if patient_data['fbs'] == 1 else 'No', '> 120 mg/dl'],
        ['Resting ECG', str(patient_data['restecg']), '0-2 (Normal range)'],
        ['Max Heart Rate', f"{patient_data['thalach']} bpm", '60-100 bpm'],
        ['Exercise Induced Angina', 'Yes' if patient_data['exang'] == 1 else 'No', 'No (Ideal)'],
        ['ST Depression (Oldpeak)', f"{patient_data['oldpeak']}", '< 2.0'],
        ['ST Slope', str(patient_data['slope']), '0-2'],
        ['Major Vessels (CA)', str(patient_data['ca']), '0-3'],
        ['Thalassemia', str(patient_data['thal']), '0-3'],
    ]
    
    medical_table = Table(medical_data, colWidths=[2.2*inch, 2*inch, 2.3*inch])
    medical_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1e40af')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 12),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('TOPPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.black),
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 1), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 1), (-1, -1), 6),
        ('TOPPADDING', (0, 1), (-1, -1), 6),
    ]))
    
    elements.append(medical_table)
    elements.append(Spacer(1, 0.3*inch))
    
    # Prediction Result
    result_heading = Paragraph("Prediction Result", heading_style)
    elements.append(result_heading)
    
    # Color code based on risk
    risk_color = colors.HexColor('#dc2626') if patient_data['prediction'] == 'High Risk' else colors.HexColor('#16a34a')
    
    result_data = [
        ['Prediction:', patient_data['prediction']],
        ['Risk Probability:', f"{patient_data['risk_probability']}%"],
    ]
    
    result_table = Table(result_data, colWidths=[2.5*inch, 4*inch])
    result_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#e0e7ff')),
        ('TEXTCOLOR', (1, 0), (1, 0), risk_color),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTNAME', (1, 0), (1, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 12),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
        ('TOPPADDING', (0, 0), (-1, -1), 10),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
    ]))
    
    elements.append(result_table)
    elements.append(Spacer(1, 0.3*inch))
    
    # Recommendations
    recommendations_heading = Paragraph("Recommendations", heading_style)
    elements.append(recommendations_heading)
    
    if patient_data['prediction'] == 'High Risk':
        recommendations = [
            "Consult with a cardiologist immediately for detailed evaluation",
            "Schedule comprehensive cardiac screening including ECG and stress test",
            "Monitor blood pressure and cholesterol levels regularly",
            "Adopt a heart-healthy diet low in saturated fats and sodium",
            "Engage in regular physical activity as recommended by your doctor",
            "Avoid smoking and limit alcohol consumption",
            "Manage stress through relaxation techniques",
            "Take prescribed medications as directed"
        ]
    else:
        recommendations = [
            "Continue maintaining a healthy lifestyle",
            "Regular health check-ups annually",
            "Maintain balanced diet and regular exercise",
            "Monitor blood pressure and cholesterol periodically",
            "Avoid smoking and excessive alcohol consumption",
            "Manage stress levels effectively"
        ]
    
    for i, rec in enumerate(recommendations, 1):
        rec_text = Paragraph(f"{i}. {rec}", normal_style)
        elements.append(rec_text)
    
    elements.append(Spacer(1, 0.3*inch))
    
    # Disclaimer
    disclaimer_style = ParagraphStyle(
        'Disclaimer',
        parent=styles['Normal'],
        fontSize=9,
        textColor=colors.HexColor('#6b7280'),
        alignment=TA_JUSTIFY,
        spaceBefore=12,
        borderColor=colors.HexColor('#d1d5db'),
        borderWidth=1,
        borderPadding=10,
        backColor=colors.HexColor('#f9fafb')
    )
    
    disclaimer_text = """
    <b>DISCLAIMER:</b> This prediction is generated by a machine learning model and should be used 
    as a decision support tool only. It does not replace professional medical diagnosis or advice. 
    Please consult with a qualified healthcare provider for proper medical evaluation and treatment. 
    The accuracy of this prediction depends on the quality and completeness of input data.
    """
    
    disclaimer = Paragraph(disclaimer_text, disclaimer_style)
    elements.append(disclaimer)
    
    # Build PDF
    doc.build(elements)
    
    buffer.seek(0)
    return buffer
