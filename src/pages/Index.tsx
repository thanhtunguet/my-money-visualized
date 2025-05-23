import { useAuth } from "@/context/auth-context";
import { MainLayout } from "@/components/layout/main-layout";
import { ThemeProvider } from "@/components/theme-provider";
import { StatCard } from "@/components/dashboard/stat-card";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { MonthlyChart } from "@/components/dashboard/monthly-chart";
import { CategoryPieChart } from "@/components/dashboard/category-pie-chart";
import { BudgetProgress } from "@/components/dashboard/budget-progress";
import { TransactionForm } from "@/components/transactions/transaction-form";
import {
  getNetBalance,
  getTotalIncome,
  getTotalExpenses,
  formatCurrency,
} from "@/lib/finance-utils";
import {
  ArrowUpRight,
  ArrowDownRight,
  WalletCards,
  Wallet,
} from "lucide-react";
import { useFinance } from "@/context";

const Index = () => {
  const { state, isLoading } = useFinance();
  const { signOut } = useAuth();

  const totalIncome = getTotalIncome(state.transactions);
  const totalExpenses = getTotalExpenses(state.transactions);
  const netBalance = getNetBalance(state.transactions);

  if (isLoading) {
    return (
      <ThemeProvider defaultTheme="system" storageKey="moneyminder-theme">
        <MainLayout currentPage="dashboard">
          <div className="h-[80vh] w-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </MainLayout>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider defaultTheme="system" storageKey="moneyminder-theme">
      <MainLayout
        currentPage="dashboard"
        userActions={
          <button
            onClick={() => signOut()}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Sign Out
          </button>
        }
      >
        <div className="space-y-8">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Balance"
              value={formatCurrency(netBalance)}
              icon={<Wallet className="h-4 w-4" />}
            />
            <StatCard
              title="Income"
              value={formatCurrency(totalIncome)}
              trend={{ value: 12, isPositive: true }}
              icon={<ArrowUpRight className="h-4 w-4" />}
            />
            <StatCard
              title="Expenses"
              value={formatCurrency(totalExpenses)}
              trend={{ value: 5, isPositive: false }}
              icon={<ArrowDownRight className="h-4 w-4" />}
            />
            <StatCard
              title="Monthly Budget"
              value={formatCurrency(
                state.budgets.reduce((acc, budget) => acc + budget.amount, 0)
              )}
              icon={<WalletCards className="h-4 w-4" />}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <MonthlyChart />
            <CategoryPieChart />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <RecentTransactions />
            </div>
            <div>
              <BudgetProgress />
            </div>
          </div>

          <div>
            <TransactionForm />
          </div>
        </div>
      </MainLayout>
    </ThemeProvider>
  );
};

export default Index;
