import React, { useState } from 'react';
import {
  Customer,
  CustomerTier,
  CreateCustomerDTO,
  CustomerContactInfo,
} from '../types/order-management.types';
import {
  Users,
  Plus,
  Search,
  Phone,
  Mail,
  MapPin,
  Award,
  X,
  CheckCircle,
  Copy,
  Check,
} from 'lucide-react';

interface CustomersTabProps {
  customers: Customer[];
  onAddCustomer: (newCust: Customer) => void;
}

export const CustomersTab: React.FC<CustomersTabProps> = ({ customers, onAddCustomer }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form states for CreateCustomerDTO (Utility Type: Omit)
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [tier, setTier] = useState<CustomerTier>(CustomerTier.STANDARD);
  const [street, setStreet] = useState('');
  const [ward, setWard] = useState('');
  const [district, setDistrict] = useState('');
  const [city, setCity] = useState('Hà Nội');

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm)
  );

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    const dto: CreateCustomerDTO = {
      name,
      email,
      phone,
      tier,
      isActive: true,
      address: {
        street,
        ward,
        district,
        city,
        country: 'Việt Nam',
      },
    };

    const newCust: Customer = {
      ...dto,
      id: `CUST-${String(customers.length + 1).padStart(3, '0')}`,
      totalSpent: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onAddCustomer(newCust);
    setIsModalOpen(false);
    // Reset form
    setName('');
    setEmail('');
    setPhone('');
    setStreet('');
    setWard('');
    setDistrict('');
  };

  const copyShippingLabel = (cust: Customer) => {
    // Utility Type: Pick<Customer, 'name' | 'phone' | 'address'>
    const contactInfo: CustomerContactInfo = {
      name: cust.name,
      phone: cust.phone,
      address: cust.address,
    };
    const labelText = `Người nhận: ${contactInfo.name} | SĐT: ${contactInfo.phone}\nĐịa chỉ: ${contactInfo.address.street}, ${contactInfo.address.ward}, ${contactInfo.address.district}, ${contactInfo.address.city}`;
    navigator.clipboard.writeText(labelText);
    setCopiedId(cust.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  return (
    <div>
      {/* Header Bar */}
      <div className="glass-panel" style={{ marginBottom: '20px', padding: '16px 20px' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '360px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
            <input
              type="text"
              placeholder="Tìm theo tên, email, SĐT khách hàng..."
              className="form-control"
              style={{ paddingLeft: '38px' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={16} /> Thêm khách hàng (CreateCustomerDTO)
          </button>
        </div>
      </div>

      {/* Customers Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        {filteredCustomers.map((cust) => (
          <div key={cust.id} className="glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
              <img
                src={cust.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
                alt={cust.name}
                style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border-subtle)' }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{cust.name}</h4>
                  <span className={`badge badge-tier-${cust.tier.toLowerCase()}`}>
                    <Award size={12} /> {cust.tier}
                  </span>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                  {cust.id}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)', flex: 1, marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={14} color="var(--primary)" /> {cust.phone}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={14} color="var(--accent-cyan)" /> {cust.email}
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <MapPin size={14} color="var(--accent-emerald)" style={{ flexShrink: 0, marginTop: '3px' }} />
                <span>
                  {cust.address.street}, {cust.address.ward}, {cust.address.district}, {cust.address.city}
                </span>
              </div>
            </div>

            <div style={{ paddingTop: '12px', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Tổng chi tiêu</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-emerald)' }}>
                  {formatCurrency(cust.totalSpent)}
                </div>
              </div>

              <button
                className="btn btn-secondary btn-sm"
                title="Sao chép nhãn vận chuyển (CustomerContactInfo: Pick<Customer, 'name' | 'phone' | 'address'>)"
                onClick={() => copyShippingLabel(cust)}
              >
                {copiedId === cust.id ? <Check size={14} color="var(--accent-emerald)" /> : <Copy size={14} />}
                {copiedId === cust.id ? 'Đã copy' : 'Copy nhãn'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add Customer (CreateCustomerDTO) */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleCreateCustomer}>
              <div className="modal-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Users className="brand-icon" style={{ width: '36px', height: '36px' }} />
                  <h3 style={{ fontSize: '1.15rem' }}>Thêm khách hàng mới</h3>
                </div>
                <button type="button" className="btn-icon btn-secondary" onClick={() => setIsModalOpen(false)}>
                  <X size={18} />
                </button>
              </div>

              <div className="modal-body">
                <p style={{ fontSize: '0.8rem', color: '#818cf8', marginBottom: '16px' }}>
                  * Áp dụng Utility Type: <code>CreateCustomerDTO = Omit&lt;Customer, 'id' | 'createdAt' | 'updatedAt' | 'totalSpent'&gt;</code>
                </p>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Họ và tên</label>
                    <input
                      type="text"
                      required
                      className="form-control"
                      placeholder="VD: Nguyễn Văn An"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Hạng thành viên (CustomerTier)</label>
                    <select className="form-control" value={tier} onChange={(e) => setTier(e.target.value as CustomerTier)}>
                      <option value={CustomerTier.STANDARD}>STANDARD (Chuẩn)</option>
                      <option value={CustomerTier.SILVER}>SILVER (Bạc - Giảm 2%)</option>
                      <option value={CustomerTier.GOLD}>GOLD (Vàng - Giảm 5%)</option>
                      <option value={CustomerTier.PLATINUM}>PLATINUM (Bạch kim - Giảm 10%)</option>
                    </select>
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      required
                      className="form-control"
                      placeholder="an.nguyen@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Số điện thoại</label>
                    <input
                      type="tel"
                      required
                      className="form-control"
                      placeholder="0912 345 678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Số nhà, tên đường</label>
                    <input
                      type="text"
                      required
                      className="form-control"
                      placeholder="VD: 182 Giải Phóng"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phường / Xã</label>
                    <input
                      type="text"
                      required
                      className="form-control"
                      placeholder="VD: Phường Phương Liệt"
                      value={ward}
                      onChange={(e) => setWard(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Quận / Huyện</label>
                    <input
                      type="text"
                      required
                      className="form-control"
                      placeholder="VD: Quận Thanh Xuân"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Tỉnh / Thành phố</label>
                    <input
                      type="text"
                      required
                      className="form-control"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Hủy
                </button>
                <button type="submit" className="btn btn-primary">
                  <CheckCircle size={16} /> Lưu khách hàng (Type-Safe)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
