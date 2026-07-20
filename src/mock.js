// Mock data para desarrollo frontend

export const mockUser = {
  id: 'user-123',
  email: 'user@example.com',
  name: 'John Smith',
  picture: 'https://via.placeholder.com/150',
  referralCode: 'JOHN2024',
  totalInvested: 25000,
  totalEarnings: 3750,
  activeInvestments: 3
};

export const mockInvestments = [
  {
    id: 'inv-1',
    plan: 'Retiro 15 días',
    amount: 5000,
    returnRate: 7,
    status: 'active',
    startDate: '2025-01-15',
    nextWithdrawal: '2025-01-30',
    earnings: 350,
    market: 'tangible'
  },
  {
    id: 'inv-2',
    plan: 'Retiro mensual',
    amount: 15000,
    returnRate: 15,
    status: 'active',
    startDate: '2024-12-20',
    nextWithdrawal: '2025-02-20',
    earnings: 2250,
    market: 'intangible'
  },
  {
    id: 'inv-3',
    plan: 'Retiro 15 días',
    amount: 5000,
    returnRate: 5,
    status: 'completed',
    startDate: '2024-11-01',
    endDate: '2024-12-15',
    earnings: 1150,
    market: 'tangible'
  }
];

export const mockReferrals = [
  {
    id: 'ref-1',
    name: 'Mary Johnson',
    email: 'mary@example.com',
    joined: '2024-12-10',
    invested: 8000,
    bonus: 480,
    status: 'active'
  },
  {
    id: 'ref-2',
    name: 'Charles Wilson',
    email: 'charles@example.com',
    joined: '2024-11-25',
    invested: 12000,
    bonus: 720,
    status: 'active'
  },
  {
    id: 'ref-3',
    name: 'Anna Martinez',
    email: 'anna@example.com',
    joined: '2025-01-05',
    invested: 5000,
    bonus: 300,
    status: 'pending'
  }
];

export const mockTransactions = [
  {
    id: 'txn-1',
    type: 'deposit',
    amount: 15000,
    status: 'completed',
    date: '2024-12-20',
    plan: 'Retiro mensual'
  },
  {
    id: 'txn-2',
    type: 'withdrawal',
    amount: 350,
    status: 'completed',
    date: '2025-01-15',
    plan: 'Retiro 15 días'
  },
  {
    id: 'txn-3',
    type: 'deposit',
    amount: 5000,
    status: 'pending',
    date: '2025-01-18',
    plan: 'Retiro 15 días'
  },
  {
    id: 'txn-4',
    type: 'referral_bonus',
    amount: 480,
    status: 'completed',
    date: '2024-12-10',
    referral: 'Mary Johnson'
  }
];

export const mockAdminStats = {
  totalUsers: 1247,
  activeInvestments: 3891,
  totalInvested: 12450000,
  totalEarnings: 1867500,
  pendingWithdrawals: 234500,
  thisMonthDeposits: 2345000,
  thisMonthWithdrawals: 567890
};

export const mockAdminUsers = [
  {
    id: 'user-1',
    name: 'John Smith',
    email: 'john@example.com',
    totalInvested: 25000,
    totalEarnings: 3750,
    activeInvestments: 3,
    referrals: 3,
    joined: '2024-10-15',
    status: 'active'
  },
  {
    id: 'user-2',
    name: 'Mary Johnson',
    email: 'mary@example.com',
    totalInvested: 8000,
    totalEarnings: 640,
    activeInvestments: 1,
    referrals: 0,
    joined: '2024-12-10',
    status: 'active'
  },
  {
    id: 'user-3',
    name: 'Charles Wilson',
    email: 'charles@example.com',
    totalInvested: 45000,
    totalEarnings: 7200,
    activeInvestments: 5,
    referrals: 8,
    joined: '2024-09-01',
    status: 'active'
  }
];

export const mockAdminTransactions = [
  {
    id: 'txn-admin-1',
    userId: 'user-1',
    userName: 'John Smith',
    type: 'deposit',
    amount: 15000,
    status: 'pending',
    date: '2025-01-18',
    plan: 'Retiro mensual'
  },
  {
    id: 'txn-admin-2',
    userId: 'user-2',
    userName: 'Mary Johnson',
    type: 'withdrawal',
    amount: 640,
    status: 'pending',
    date: '2025-01-17',
    plan: 'Retiro 15 días'
  },
  {
    id: 'txn-admin-3',
    userId: 'user-3',
    userName: 'Charles Wilson',
    type: 'deposit',
    amount: 20000,
    status: 'completed',
    date: '2025-01-16',
    plan: 'Retiro mensual'
  }
];

export const investmentPlans = [
  {
    id: 'plan-1',
    name: 'Retiro 15 días',
    minAmount: 100,
    maxAmount: 9999,
    returnRate: '3% - 7%',
    withdrawalPeriod: '15 días',
    market: 'Tangibles',
    description: 'Plan ideal para inversiones pequeñas con retiros frecuentes'
  },
  {
    id: 'plan-2',
    name: 'Retiro 15 días',
    minAmount: 10000,
    maxAmount: null,
    returnRate: '8% - 12%',
    withdrawalPeriod: '15 días',
    market: 'Tangibles e Intangibles',
    description: 'Plan avanzado con mayores retornos para inversiones significativas'
  },
  {
    id: 'plan-3',
    name: 'Retiro mensual',
    minAmount: 10000,
    maxAmount: null,
    returnRate: '12% - 20%',
    withdrawalPeriod: 'Mensual',
    market: 'Intangibles',
    description: 'Plan premium con los mayores retornos del mercado'
  }
];
