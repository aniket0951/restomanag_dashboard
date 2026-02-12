import { useState } from "react";
import {
  User,
  Bell,
  Shield,
  Camera,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Smartphone,
  History,
  Save,
  AlertCircle,
} from "lucide-react";
import { useUserStore } from "../../../store/user_store";
import toast from "react-hot-toast";

type TabType = "profile" | "notifications" | "security";

function Settings() {
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const user = useUserStore((state) => state.user);

  const tabs = [
    { id: "profile" as TabType, label: "Profile", icon: User },
    { id: "notifications" as TabType, label: "Notifications", icon: Bell },
    { id: "security" as TabType, label: "Security", icon: Shield },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-slate-400 mt-1">Manage your account settings and preferences</p>
      </div>

      {/* Tabs & Content */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:w-64 bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-2xl border border-white/10 p-4">
          <nav className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white border border-blue-500/20"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
          {activeTab === "profile" && <ProfileSection user={user} />}
          {activeTab === "notifications" && <NotificationsSection />}
          {activeTab === "security" && <SecuritySection />}
        </div>
      </div>
    </div>
  );
}

// Profile Section
function ProfileSection({ user }: { user: { id: string; name: string; email: string } | null }) {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    bio: "",
  });

  const handleSave = () => {
    toast.success("Profile updated successfully");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white">Profile Information</h2>
        <p className="text-slate-400 text-sm mt-1">Update your personal details</p>
      </div>

      {/* Profile Picture */}
      <div className="flex items-center gap-6">
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=200"
            alt="Profile"
            className="w-24 h-24 rounded-2xl object-cover ring-4 ring-white/10"
          />
          <button className="absolute -bottom-2 -right-2 p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200">
            <Camera className="w-4 h-4" />
          </button>
        </div>
        <div>
          <h3 className="text-white font-medium">{user?.name || "User"}</h3>
          <p className="text-slate-400 text-sm">JPG, PNG or GIF. Max 2MB</p>
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            <User className="w-4 h-4 inline mr-2" />
            Full Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
            placeholder="Enter your name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            <Mail className="w-4 h-4 inline mr-2" />
            Email Address
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            <Phone className="w-4 h-4 inline mr-2" />
            Phone Number
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
            placeholder="Enter your phone"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-300 mb-2">Bio</label>
          <textarea
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            rows={4}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 resize-none"
            placeholder="Write a short bio about yourself..."
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200"
        >
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>
    </div>
  );
}

// Notifications Section
function NotificationsSection() {
  const [notifications, setNotifications] = useState({
    emailOrders: true,
    emailPromotions: false,
    pushOrders: true,
    pushAlerts: true,
    smsOrders: false,
    smsAlerts: false,
  });

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications({ ...notifications, [key]: !notifications[key] });
  };

  const notificationGroups = [
    {
      title: "Email Notifications",
      icon: Mail,
      items: [
        { key: "emailOrders" as const, label: "Order Updates", description: "Get notified when order status changes" },
        { key: "emailPromotions" as const, label: "Promotions & News", description: "Receive promotional emails and news" },
      ],
    },
    {
      title: "Push Notifications",
      icon: Bell,
      items: [
        { key: "pushOrders" as const, label: "New Orders", description: "Instant alerts for new orders" },
        { key: "pushAlerts" as const, label: "System Alerts", description: "Important system notifications" },
      ],
    },
    {
      title: "SMS Notifications",
      icon: Smartphone,
      items: [
        { key: "smsOrders" as const, label: "Order Alerts", description: "SMS for critical order updates" },
        { key: "smsAlerts" as const, label: "Security Alerts", description: "SMS for security-related events" },
      ],
    },
  ];

  const handleSave = () => {
    toast.success("Notification preferences saved");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white">Notification Preferences</h2>
        <p className="text-slate-400 text-sm mt-1">Choose how you want to be notified</p>
      </div>

      {notificationGroups.map((group) => (
        <div key={group.title} className="space-y-4">
          <div className="flex items-center gap-2 text-white">
            <group.icon className="w-5 h-5 text-blue-400" />
            <h3 className="font-medium">{group.title}</h3>
          </div>

          <div className="space-y-3 pl-7">
            {group.items.map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-all duration-200"
              >
                <div>
                  <p className="text-white font-medium">{item.label}</p>
                  <p className="text-slate-400 text-sm">{item.description}</p>
                </div>
                <button
                  onClick={() => toggleNotification(item.key)}
                  className={`relative w-12 h-6 rounded-full transition-all duration-200 ${
                    notifications[item.key]
                      ? "bg-gradient-to-r from-blue-500 to-purple-600"
                      : "bg-white/10"
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-200 ${
                      notifications[item.key] ? "left-7" : "left-1"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Save Button */}
      <div className="flex justify-end pt-4">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200"
        >
          <Save className="w-4 h-4" />
          Save Preferences
        </button>
      </div>
    </div>
  );
}

// Security Section
function SecuritySection() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const loginHistory = [
    { device: "Chrome on Windows", location: "Mumbai, India", time: "2 hours ago", current: true },
    { device: "Safari on iPhone", location: "Mumbai, India", time: "Yesterday" },
    { device: "Firefox on MacOS", location: "Delhi, India", time: "3 days ago" },
  ];

  const handleChangePassword = () => {
    if (passwords.new !== passwords.confirm) {
      toast.error("Passwords do not match");
      return;
    }
    if (passwords.new.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    toast.success("Password changed successfully");
    setPasswords({ current: "", new: "", confirm: "" });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-white">Security Settings</h2>
        <p className="text-slate-400 text-sm mt-1">Manage your account security</p>
      </div>

      {/* Change Password */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-white">
          <Lock className="w-5 h-5 text-blue-400" />
          <h3 className="font-medium">Change Password</h3>
        </div>

        <div className="space-y-4 pl-7">
          <div className="relative">
            <input
              type={showCurrentPassword ? "text" : "password"}
              value={passwords.current}
              onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 pr-12"
              placeholder="Current Password"
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
            >
              {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              value={passwords.new}
              onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 pr-12"
              placeholder="New Password"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
            >
              {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={passwords.confirm}
              onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 pr-12"
              placeholder="Confirm New Password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <button
            onClick={handleChangePassword}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200"
          >
            <Lock className="w-4 h-4" />
            Update Password
          </button>
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-white">
          <Shield className="w-5 h-5 text-blue-400" />
          <h3 className="font-medium">Two-Factor Authentication</h3>
        </div>

        <div className="pl-7">
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${twoFactorEnabled ? "bg-emerald-500/20" : "bg-amber-500/20"}`}>
                <Shield className={`w-6 h-6 ${twoFactorEnabled ? "text-emerald-400" : "text-amber-400"}`} />
              </div>
              <div>
                <p className="text-white font-medium">
                  {twoFactorEnabled ? "2FA is Enabled" : "2FA is Disabled"}
                </p>
                <p className="text-slate-400 text-sm">
                  {twoFactorEnabled
                    ? "Your account is protected with 2FA"
                    : "Add an extra layer of security to your account"}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setTwoFactorEnabled(!twoFactorEnabled);
                toast.success(twoFactorEnabled ? "2FA disabled" : "2FA enabled");
              }}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                twoFactorEnabled
                  ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                  : "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
              }`}
            >
              {twoFactorEnabled ? "Disable" : "Enable"}
            </button>
          </div>
        </div>
      </div>

      {/* Login History */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-white">
          <History className="w-5 h-5 text-blue-400" />
          <h3 className="font-medium">Login History</h3>
        </div>

        <div className="pl-7 space-y-3">
          {loginHistory.map((session, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-white/5">
                  <Smartphone className="w-5 h-5 text-slate-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-white font-medium">{session.device}</p>
                    {session.current && (
                      <span className="px-2 py-0.5 text-xs bg-emerald-500/20 text-emerald-400 rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-slate-400 text-sm">
                    {session.location} • {session.time}
                  </p>
                </div>
              </div>
              {!session.current && (
                <button className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors">
                  Revoke
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="space-y-4 pt-4 border-t border-white/10">
        <div className="flex items-center gap-2 text-red-400">
          <AlertCircle className="w-5 h-5" />
          <h3 className="font-medium">Danger Zone</h3>
        </div>

        <div className="pl-7">
          <div className="flex items-center justify-between p-4 bg-red-500/10 rounded-xl border border-red-500/20">
            <div>
              <p className="text-white font-medium">Delete Account</p>
              <p className="text-slate-400 text-sm">Permanently delete your account and all data</p>
            </div>
            <button className="px-4 py-2 bg-red-500/20 text-red-400 rounded-xl font-medium hover:bg-red-500/30 transition-all duration-200">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
