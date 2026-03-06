import React, { useState } from 'react';
import {
  View, Text, ScrollView, TextInput, TouchableOpacity,
  StyleSheet, Switch, StatusBar, Modal, Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft, ChevronRight, Plus, Edit2, MapPin,
  Landmark, PenLine, BookOpen, FileText, Tag,
  Truck, Box, Paperclip, ChevronDown,
} from 'lucide-react-native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import { Alert } from 'react-native';

const C = {
  bg: '#12172B', card: '#1A2035', cardAlt: '#1E2640',
  accent: '#F59E0B', text: '#FFFFFF', sub: '#8892A4',
  border: '#2A3350', input: '#0F172A', green: '#34D399',
  blue: '#60A5FA', red: '#F87171', purple: '#A78BFA',
};

type Item = { id: number; name: string; qty: string; rate: string; unit: string; hsn: string };

let itemCounter = 1;

const PAYMENT_MODES = ['UPI', 'Cash', 'Cheque', 'Bank Transfer', 'Card'];

export default function NewInvoiceScreen() {
  const router = useRouter();
  const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-');
  const invoiceNo = 'INV-1';

  const [customer, setCustomer] = useState('');
  const [items, setItems] = useState<Item[]>([]);
  const [showDesc, setShowDesc] = useState(false);
  const [exportSEZ, setExportSEZ] = useState(false);
  const [rcm, setRcm] = useState(false);
  const [tds, setTds] = useState(false);
  const [tcs, setTcs] = useState(false);
  const [roundOff, setRoundOff] = useState(true);
  const [markPaid, setMarkPaid] = useState(false);
  const [amountReceived, setAmountReceived] = useState('0.0');
  const [paymentMode, setPaymentMode] = useState('UPI');
  const [paymentNote, setPaymentNote] = useState('');
  const [showPaymentPicker, setShowPaymentPicker] = useState(false);
  const [addItemVisible, setAddItemVisible] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', qty: '1', rate: '', unit: 'UNT', hsn: '' });

  const subTotal = items.reduce((sum, i) => sum + (parseFloat(i.qty) || 0) * (parseFloat(i.rate) || 0), 0);
  const gst = subTotal * 0.18;
  const roundedGst = Math.round(gst * 100) / 100;
  const total = roundOff ? Math.round(subTotal + roundedGst) : subTotal + roundedGst;
  const roundOffAmt = roundOff ? total - (subTotal + roundedGst) : 0;

  const queryClient = useQueryClient();
  const createMutation = useMutation({
    mutationFn: async () => {
      // Create a simplified payload for the invoice
      const payload = {
        party_id: 1, // hardcoded or derived from selected customer in a real app
        type: 'sales', // ensure invoice type is sales
        date: new Date().toISOString().split('T')[0],
        due_date: new Date().toISOString().split('T')[0],
        status: 'draft',
        items: items.map(item => ({
          item_id: 1, // hardcoded or derived from selected item
          description: item.name,
          quantity: parseFloat(item.qty) || 1,
          unit_price: parseFloat(item.rate) || 0,
          tax_rate: 18,
        })),
        notes: paymentNote,
      };
      await api.post('/v1/invoices', payload);
    },
    onSuccess: () => {
      Alert.alert('Success', 'Invoice created successfully');
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      router.back();
    },
    onError: (error: any) => {
      Alert.alert('Error', error?.response?.data?.message || 'Failed to create invoice');
    }
  });

  const handleCreate = () => {
    if (items.length === 0) {
      Alert.alert('Error', 'Please add at least one item');
      return;
    }
    createMutation.mutate();
  };

  const addItem = () => {
    if (!newItem.name || !newItem.rate) return;
    setItems([...items, { id: itemCounter++, ...newItem }]);
    setNewItem({ name: '', qty: '1', rate: '', unit: 'UNT', hsn: '' });
    setAddItemVisible(false);
  };

  const removeItem = (id: number) => setItems(items.filter(i => i.id !== id));

  const Checkbox = ({ value, onToggle, label }: { value: boolean; onToggle: () => void; label: string }) => (
    <TouchableOpacity style={s.checkRow} onPress={onToggle} activeOpacity={0.7}>
      <View style={[s.checkbox, value && s.checkboxOn]}>
        {value && <Text style={s.checkmark}>✓</Text>}
      </View>
      <Text style={s.checkLabel}>{label}</Text>
    </TouchableOpacity>
  );

  const SectionRow = ({ icon: Icon, label, value, onPress }: any) => (
    <TouchableOpacity style={s.optRow} onPress={onPress} activeOpacity={0.7}>
      <Icon size={18} color={C.sub} strokeWidth={1.5} style={{ marginRight: 12 }} />
      <Text style={[s.optLabel, value && s.optValue]}>{value || label}</Text>
      {value
        ? <TouchableOpacity><Text style={s.changeBtn}>Change</Text></TouchableOpacity>
        : <ChevronRight size={16} color={C.sub} />
      }
    </TouchableOpacity>
  );

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />

      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.headerBtn}>
          <ArrowLeft size={22} color={C.text} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Create Invoice</Text>
        <TouchableOpacity style={[s.headerBtn, s.saveBtn]} onPress={handleCreate} disabled={createMutation.isPending}>
          <Text style={s.saveBtnText}>{createMutation.isPending ? '...' : 'Save'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>

        {/* Invoice # */}
        <View style={s.card}>
          <View style={s.cardRow}>
            <View style={{ flex: 1 }}>
              <Text style={s.cardMeta}>Invoice #</Text>
              <Text style={s.invoiceNo}>{invoiceNo}</Text>
              <Text style={s.invoiceDate}>{today}</Text>
            </View>
            <TouchableOpacity style={s.editPill}>
              <Text style={s.editPillText}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Export/SEZ */}
        <View style={[s.card, { paddingVertical: 12 }]}>
          <Checkbox value={exportSEZ} onToggle={() => setExportSEZ(!exportSEZ)} label="Export Invoice / SEZ" />
        </View>

        {/* Customer */}
        <View style={s.card}>
          <View style={s.sectionHeader}>
            <Text style={s.sectionTitle}>Customer</Text>
          </View>
          {customer ? (
            <View style={s.customerRow}>
              <Text style={s.customerName} numberOfLines={1}>{customer}</Text>
              <View style={s.rowGap}>
                <TouchableOpacity><Text style={s.blueLink}>View</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => setCustomer('')}><Text style={s.blueLink}>Change</Text></TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity style={s.selectBox} activeOpacity={0.7}>
              <TextInput
                style={s.selectInput}
                placeholder="Select customer..."
                placeholderTextColor={C.sub}
                value={customer}
                onChangeText={setCustomer}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Products */}
        <View style={s.card}>
          <View style={s.sectionHeader}>
            <Text style={s.sectionTitle}>Products</Text>
            <TouchableOpacity style={s.addEditBtn} onPress={() => setAddItemVisible(true)}>
              <Plus size={13} color={C.accent} />
              <Text style={s.addEditText}> Add / Edit</Text>
            </TouchableOpacity>
          </View>

          <Checkbox value={showDesc} onToggle={() => setShowDesc(!showDesc)} label="Show Description" />

          {items.length === 0 && (
            <Text style={s.emptyItems}>No items added yet</Text>
          )}

          {items.map((item) => (
            <View key={item.id} style={s.itemCard}>
              <View style={s.itemRow}>
                <Text style={s.itemName} numberOfLines={1}>{item.name}</Text>
                <Text style={s.itemPrice}>₹{(parseFloat(item.qty) * parseFloat(item.rate)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Text>
              </View>
              <View style={s.itemRow}>
                <Text style={s.itemSub}>x{item.qty} {item.unit}{item.hsn ? `  (HSN/SAC: ${item.hsn})` : ''}</Text>
                <Text style={s.detailsLink}>Details <ChevronRight size={11} color={C.blue} /></Text>
              </View>
              <View style={s.itemActions}>
                <TouchableOpacity>
                  <Text style={s.editLink}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => removeItem(item.id)}>
                  <Text style={s.removeLink}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          <TouchableOpacity style={s.addMoreBtn} onPress={() => setAddItemVisible(true)}>
            <Plus size={15} color={C.sub} />
            <Text style={s.addMoreText}>  Add More Items</Text>
          </TouchableOpacity>
        </View>

        {/* Custom Fields Banner */}
        <TouchableOpacity style={s.customFieldBanner} activeOpacity={0.8}>
          <View style={{ flex: 1 }}>
            <Text style={s.customFieldTitle}>Add Custom Fields</Text>
            <Text style={s.customFieldSub}>Personalize to perfectly suit your style.</Text>
          </View>
          <View style={s.customFieldIcon}>
            <Text style={{ fontSize: 20 }}>🎨</Text>
          </View>
        </TouchableOpacity>

        {/* Optional */}
        <View style={s.card}>
          <View style={s.sectionHeader}>
            <Text style={s.sectionTitle}>Optional</Text>
            <TouchableOpacity><Text style={s.accentLink}>⊕ Additional Charges</Text></TouchableOpacity>
          </View>
          <SectionRow icon={MapPin} label="Select Dispatch Address" />
          <View style={s.divider} />
          <SectionRow icon={MapPin} label="Shipping Address" value="" />
          <View style={s.divider} />
          <SectionRow icon={Landmark} label="Bank" value="" />
          <View style={s.divider} />
          <SectionRow icon={PenLine} label="Select Signature" />
          <View style={s.divider} />
          <SectionRow icon={BookOpen} label="Add Reference" />
          <View style={s.divider} />
          <SectionRow icon={FileText} label="Add Notes" />
          <View style={s.divider} />
          <SectionRow icon={FileText} label="Add Terms" />
          <View style={s.divider} />
          <SectionRow icon={Tag} label="Add Extra Discount" />
          <View style={s.divider} />
          <SectionRow icon={Truck} label="Delivery/Shipping Charges" />
          <View style={s.divider} />
          <SectionRow icon={Box} label="Packaging Charges" />
          <View style={s.divider} />
          <SectionRow icon={Paperclip} label="Attachments" />
        </View>

        {/* Tax */}
        <View style={s.card}>
          <Text style={s.sectionTitle}>Tax</Text>
          <View style={s.switchRow}>
            <Text style={s.switchLabel}>TDS</Text>
            <Switch value={tds} onValueChange={setTds} thumbColor={tds ? C.accent : '#555'} trackColor={{ false: C.border, true: '#7C4A00' }} />
          </View>
          <View style={s.divider} />
          <View style={s.switchRow}>
            <Text style={s.switchLabel}>TCS</Text>
            <Switch value={tcs} onValueChange={setTcs} thumbColor={tcs ? C.accent : '#555'} trackColor={{ false: C.border, true: '#7C4A00' }} />
          </View>
          <View style={s.divider} />
          <Checkbox value={rcm} onToggle={() => setRcm(!rcm)} label="RCM Applicable" />
        </View>

        {/* Payments */}
        <View style={s.card}>
          <Text style={s.sectionTitle}>Payments</Text>
          <Checkbox value={markPaid} onToggle={() => setMarkPaid(!markPaid)} label="Mark as fully paid" />
          <View style={s.payRow}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={s.payLabel}>Amount Received</Text>
              <View style={s.payInput}>
                <Text style={s.rupee}>₹</Text>
                <TextInput
                  style={s.payInputText}
                  keyboardType="decimal-pad"
                  value={amountReceived}
                  onChangeText={setAmountReceived}
                />
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.payLabel}>Payment Mode</Text>
              <TouchableOpacity style={s.payInput} onPress={() => setShowPaymentPicker(true)}>
                <Text style={s.payInputText}>{paymentMode}</Text>
                <ChevronDown size={16} color={C.sub} />
              </TouchableOpacity>
            </View>
          </View>
          <Text style={[s.payLabel, { marginTop: 12 }]}>Notes</Text>
          <TextInput
            style={s.notesInput}
            placeholder="Advance Received, UTR Number etc..."
            placeholderTextColor={C.sub}
            value={paymentNote}
            onChangeText={setPaymentNote}
            multiline
          />
        </View>

        <View style={{ height: 130 }} />
      </ScrollView>

      {/* Summary Footer */}
      <View style={s.footer}>
        <View style={s.footerSummary}>
          <View style={s.footerRow}>
            <Text style={s.footerLabel}>Sub Total</Text>
            <Text style={s.footerValue}>₹{subTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Text>
          </View>
          <View style={s.footerRow}>
            <Text style={s.footerLabel}>CGST + SGST</Text>
            <Text style={s.footerValue}>₹{roundedGst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Text>
          </View>
          <View style={s.footerRow}>
            <Text style={s.footerLabel}>Round Off</Text>
            <View style={s.rowGap}>
              <Switch value={roundOff} onValueChange={setRoundOff} thumbColor={roundOff ? C.green : '#555'} trackColor={{ false: C.border, true: '#065F46' }} />
              <Text style={[s.footerValue, { marginLeft: 8 }]}>{roundOffAmt >= 0 ? '+' : ''}{roundOffAmt.toFixed(2)}</Text>
            </View>
          </View>
        </View>
        <View style={s.footerBottom}>
          <View>
            <Text style={s.totalLabel}>Total Amount</Text>
            <Text style={s.totalAmount}>₹{total.toLocaleString('en-IN')}</Text>
          </View>
          <TouchableOpacity style={s.createBtn} onPress={handleCreate} disabled={createMutation.isPending}>
            <Text style={s.createBtnText}>{createMutation.isPending ? 'Creating...' : 'Create  ›'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Add Item Modal */}
      <Modal visible={addItemVisible} transparent animationType="slide">
        <Pressable style={s.modalOverlay} onPress={() => setAddItemVisible(false)} />
        <View style={s.modalSheet}>
          <Text style={s.modalTitle}>Add Item</Text>
          <TextInput style={s.modalInput} placeholder="Item name *" placeholderTextColor={C.sub} value={newItem.name} onChangeText={v => setNewItem({ ...newItem, name: v })} />
          <View style={s.modalRow}>
            <TextInput style={[s.modalInput, { flex: 1, marginRight: 8 }]} placeholder="Rate (₹) *" placeholderTextColor={C.sub} keyboardType="decimal-pad" value={newItem.rate} onChangeText={v => setNewItem({ ...newItem, rate: v })} />
            <TextInput style={[s.modalInput, { flex: 1 }]} placeholder="Qty" placeholderTextColor={C.sub} keyboardType="decimal-pad" value={newItem.qty} onChangeText={v => setNewItem({ ...newItem, qty: v })} />
          </View>
          <View style={s.modalRow}>
            <TextInput style={[s.modalInput, { flex: 1, marginRight: 8 }]} placeholder="Unit (UNT)" placeholderTextColor={C.sub} value={newItem.unit} onChangeText={v => setNewItem({ ...newItem, unit: v })} />
            <TextInput style={[s.modalInput, { flex: 1 }]} placeholder="HSN/SAC" placeholderTextColor={C.sub} keyboardType="number-pad" value={newItem.hsn} onChangeText={v => setNewItem({ ...newItem, hsn: v })} />
          </View>
          <TouchableOpacity style={s.modalAddBtn} onPress={addItem}>
            <Text style={s.modalAddText}>Add Item</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Payment Mode Picker */}
      <Modal visible={showPaymentPicker} transparent animationType="slide">
        <Pressable style={s.modalOverlay} onPress={() => setShowPaymentPicker(false)} />
        <View style={s.modalSheet}>
          <Text style={s.modalTitle}>Payment Mode</Text>
          {PAYMENT_MODES.map(mode => (
            <TouchableOpacity key={mode} style={[s.modeOption, paymentMode === mode && s.modeOptionSelected]} onPress={() => { setPaymentMode(mode); setShowPaymentPicker(false); }}>
              <Text style={[s.modeText, paymentMode === mode && { color: C.accent }]}>{mode}</Text>
              {paymentMode === mode && <Text style={{ color: C.accent }}>✓</Text>}
            </TouchableOpacity>
          ))}
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: 50, paddingBottom: 14, paddingHorizontal: 16, backgroundColor: C.bg, borderBottomWidth: 1, borderBottomColor: C.border },
  headerBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, color: C.text, fontSize: 17, fontWeight: 'bold', textAlign: 'center' },
  saveBtn: { width: 'auto', paddingHorizontal: 14, paddingVertical: 6, backgroundColor: C.accent, borderRadius: 8 },
  saveBtnText: { color: '#000', fontWeight: 'bold', fontSize: 13 },
  scroll: { flex: 1 },

  card: { backgroundColor: C.card, marginHorizontal: 12, marginTop: 10, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: C.border },
  cardRow: { flexDirection: 'row', alignItems: 'flex-start' },
  cardMeta: { color: C.sub, fontSize: 11, marginBottom: 4 },
  invoiceNo: { color: C.text, fontSize: 18, fontWeight: 'bold' },
  invoiceDate: { color: C.sub, fontSize: 13, marginTop: 2 },
  editPill: { borderWidth: 1, borderColor: C.border, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 4 },
  editPillText: { color: C.text, fontSize: 13 },

  checkRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 4 },
  checkbox: { width: 20, height: 20, borderRadius: 4, borderWidth: 1.5, borderColor: C.sub, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  checkboxOn: { backgroundColor: C.accent, borderColor: C.accent },
  checkmark: { color: '#000', fontSize: 12, fontWeight: 'bold' },
  checkLabel: { color: C.text, fontSize: 14 },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { color: C.text, fontSize: 15, fontWeight: '700', marginBottom: 4 },

  customerRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.input, borderRadius: 10, padding: 12, borderWidth: 1, borderColor: C.border },
  customerName: { flex: 1, color: C.text, fontWeight: '600', fontSize: 14 },
  rowGap: { flexDirection: 'row', gap: 10 },
  blueLink: { color: C.blue, fontSize: 13, fontWeight: '600' },

  selectBox: { backgroundColor: C.input, borderRadius: 10, borderWidth: 1, borderColor: C.border },
  selectInput: { padding: 12, color: C.text, fontSize: 14 },

  addEditBtn: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: C.accent, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  addEditText: { color: C.accent, fontSize: 12, fontWeight: '600' },

  emptyItems: { color: C.sub, fontSize: 13, textAlign: 'center', paddingVertical: 16 },

  itemCard: { borderTopWidth: 1, borderTopColor: C.border, paddingTop: 12, marginTop: 12 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  itemName: { color: C.text, fontWeight: '700', fontSize: 14, flex: 1, marginRight: 8 },
  itemPrice: { color: C.text, fontWeight: '700', fontSize: 14 },
  itemSub: { color: C.sub, fontSize: 12 },
  detailsLink: { color: C.blue, fontSize: 12 },
  itemActions: { flexDirection: 'row', gap: 16, marginTop: 6 },
  editLink: { color: C.accent, fontSize: 12, fontWeight: '600' },
  removeLink: { color: C.red, fontSize: 12 },

  addMoreBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderTopWidth: 1, borderTopColor: C.border, marginTop: 12 },
  addMoreText: { color: C.sub, fontSize: 14 },

  customFieldBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1C2B4A', marginHorizontal: 12, marginTop: 10, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: '#2A3F6A' },
  customFieldTitle: { color: C.text, fontWeight: '600', fontSize: 14 },
  customFieldSub: { color: C.sub, fontSize: 12, marginTop: 2 },
  customFieldIcon: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },

  optRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 13 },
  optLabel: { flex: 1, color: C.sub, fontSize: 14 },
  optValue: { color: C.text },
  changeBtn: { color: C.blue, fontSize: 13, fontWeight: '600' },
  accentLink: { color: C.accent, fontSize: 13, fontWeight: '600' },
  divider: { height: 1, backgroundColor: C.border },

  switchRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  switchLabel: { flex: 1, color: C.text, fontSize: 14 },

  payRow: { flexDirection: 'row', marginTop: 12 },
  payLabel: { color: C.sub, fontSize: 12, marginBottom: 6 },
  payInput: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.input, borderRadius: 10, borderWidth: 1, borderColor: C.border, paddingHorizontal: 12, paddingVertical: 10 },
  rupee: { color: C.text, marginRight: 4 },
  payInputText: { flex: 1, color: C.text, fontSize: 14 },
  notesInput: { backgroundColor: C.input, borderRadius: 10, borderWidth: 1, borderColor: C.border, padding: 12, color: C.text, fontSize: 13, minHeight: 44 },

  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: C.card, borderTopWidth: 1, borderTopColor: C.border },
  footerSummary: { paddingHorizontal: 16, paddingTop: 12 },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  footerLabel: { color: C.sub, fontSize: 13 },
  footerValue: { color: C.text, fontSize: 13 },
  footerBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderTopWidth: 1, borderTopColor: C.border },
  totalLabel: { color: C.sub, fontSize: 12 },
  totalAmount: { color: C.text, fontSize: 22, fontWeight: 'bold' },
  createBtn: { backgroundColor: C.accent, borderRadius: 12, paddingHorizontal: 24, paddingVertical: 14 },
  createBtnText: { color: '#000', fontWeight: 'bold', fontSize: 16 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  modalSheet: { backgroundColor: C.card, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, borderTopWidth: 1, borderColor: C.border },
  modalTitle: { color: C.text, fontSize: 17, fontWeight: 'bold', marginBottom: 16 },
  modalRow: { flexDirection: 'row' },
  modalInput: { backgroundColor: C.input, borderRadius: 10, borderWidth: 1, borderColor: C.border, padding: 12, color: C.text, fontSize: 14, marginBottom: 10 },
  modalAddBtn: { backgroundColor: C.accent, borderRadius: 12, padding: 14, alignItems: 'center', marginTop: 4 },
  modalAddText: { color: '#000', fontWeight: 'bold', fontSize: 15 },
  modeOption: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 4, borderBottomWidth: 1, borderBottomColor: C.border },
  modeOptionSelected: { backgroundColor: 'rgba(245,158,11,0.08)', borderRadius: 8, paddingHorizontal: 10 },
  modeText: { color: C.text, fontSize: 15 },
});
