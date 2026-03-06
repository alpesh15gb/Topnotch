import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, BarChart3, PieChart, LineChart, FileText, FileBarChart, PiggyBank, ChevronRight } from 'lucide-react-native';

const C = { bg: '#12172B', card: '#1A2035', accent: '#F59E0B', text: '#FFFFFF', sub: '#8892A4', border: '#2A3350', input: '#0F172A', green: '#34D399', purple: '#A78BFA' };

const REPORT_SECTIONS = [
    {
        title: 'Financial Statements',
        icons: [BarChart3, PieChart],
        reports: [
            { id: 'pl', route: '/reports/pl', name: 'Profit & Loss', desc: 'Summary of revenues, costs and expenses' },
            { id: 'bs', route: '/reports/bs', name: 'Balance Sheet', desc: 'Assets, liabilities and equity overview' },
            { id: 'cf', route: null, name: 'Cash Flow', desc: 'Inflow and outflow of cash details' },
        ]
    },
    {
        title: 'Sales & Purchases',
        icons: [LineChart, PiggyBank],
        reports: [
            { id: 'sales', route: null, name: 'Sales Summary', desc: 'Total sales and tax collection' },
            { id: 'purchases', route: null, name: 'Purchase Summary', desc: 'Total purchases and ITC' },
            { id: 'daybook', route: '/reports/daybook', name: 'Daybook', desc: 'Daily transaction log' },
        ]
    },
    {
        title: 'Taxation (GST)',
        icons: [FileText, FileBarChart],
        reports: [
            { id: 'gstr1', route: null, name: 'GSTR-1 (Outward Supplies)', desc: 'Details of outward supplies of goods or services' },
            { id: 'gstr2', route: null, name: 'GSTR-2B (ITC matching)', desc: 'Auto-drafted ITC statement based on GSTR-1/IFF' },
            { id: 'gstr3b', route: null, name: 'GSTR-3B (Summary Return)', desc: 'Summary return of outward supplies and ITC claimed' },
        ]
    },
];

export default function ReportsIndexScreen() {
    const router = useRouter();

    return (
        <View style={s.root}>
            <StatusBar barStyle="light-content" backgroundColor={C.bg} />
            <View style={s.header}>
                <TouchableOpacity onPress={() => router.back()} style={s.headerBtn}><ArrowLeft size={22} color={C.text} /></TouchableOpacity>
                <Text style={s.headerTitle}>Reports</Text>
                <View style={s.headerBtn} />
            </View>

            <ScrollView style={s.scroll} contentContainerStyle={{ padding: 16 }}>
                <Text style={s.pageTitle}>Business Insights</Text>
                <Text style={s.pageSub}>View all your financial and tax reports in one place.</Text>

                {REPORT_SECTIONS.map((section, sIdx) => (
                    <View key={sIdx} style={s.section}>
                        <View style={s.sectionHeader}>
                            <Text style={s.sectionTitle}>{section.title}</Text>
                        </View>
                        <View style={s.card}>
                            {section.reports.map((report, rIdx) => {
                                const Icon = section.icons[rIdx % section.icons.length];
                                return (
                                    <TouchableOpacity
                                        key={report.id}
                                        style={[s.reportRow, rIdx === section.reports.length - 1 && { borderBottomWidth: 0 }, !report.route && { opacity: 0.6 }]}
                                        onPress={() => report.route && router.push(report.route as any)}
                                        disabled={!report.route}
                                    >
                                        <View style={s.iconBox}>
                                            <Icon size={20} color={sIdx === 0 ? C.purple : sIdx === 1 ? C.green : C.accent} />
                                        </View>
                                        <View style={s.reportInfo}>
                                            <Text style={s.reportName}>{report.name}</Text>
                                            <Text style={s.reportDesc} numberOfLines={1}>{report.desc}</Text>
                                        </View>
                                        <ChevronRight size={16} color={report.route ? C.sub : C.border} />
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>
                ))}
                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

const s = StyleSheet.create({
    root: { flex: 1, backgroundColor: C.bg },
    header: { flexDirection: 'row', alignItems: 'center', paddingTop: 50, paddingBottom: 14, paddingHorizontal: 16, backgroundColor: C.bg, borderBottomWidth: 1, borderBottomColor: C.border },
    headerBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
    headerTitle: { flex: 1, color: C.text, fontSize: 17, fontWeight: 'bold', textAlign: 'center' },
    scroll: { flex: 1 },
    pageTitle: { color: C.text, fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
    pageSub: { color: C.sub, fontSize: 14, marginBottom: 24 },
    section: { marginBottom: 24 },
    sectionHeader: { marginBottom: 10 },
    sectionTitle: { color: C.text, fontSize: 15, fontWeight: '700', letterSpacing: 0.5 },
    card: { backgroundColor: C.card, borderRadius: 16, paddingHorizontal: 16, borderWidth: 1, borderColor: C.border },
    reportRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: C.border },
    iconBox: { width: 40, height: 40, borderRadius: 10, backgroundColor: C.input, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
    reportInfo: { flex: 1, marginRight: 12 },
    reportName: { color: C.text, fontSize: 15, fontWeight: '600', marginBottom: 2 },
    reportDesc: { color: C.sub, fontSize: 13 },
});
