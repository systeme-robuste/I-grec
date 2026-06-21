/**
 * I-grec Application
 * Réseau Social Nouvelle Génération
 * Main application controller
 */

const App = {
    // ============ State Management ============
    user: null,
    showAuth: true,
    phone: '',
    code: '',
    step: 'phone',
    activeTab: 'home',
    activeSubTab: 'bete-pro',
    showCreateModal: false,
    showMessages: false,
    showNotifications: false,
    showVideoCall: false,
    showBadges: false,
    showLiveStream: false,
    showAIAssistant: false,
    videoCallActive: false,
    micMuted: false,
    cameraOff: false,
    selectedLanguage: 'fr',
    currentChat: null,

    // ============ Data ============
    userBadges: [
        { id: 1, name: 'Pionnier', icon: '🚀', description: 'Premier utilisateur', earned: true, date: '01/01/2026' },
        { id: 2, name: 'Créateur Pro', icon: '✨', description: '100 publications', earned: true, date: '05/01/2026' },
        { id: 3, name: 'Influenceur', icon: '⭐', description: '10K abonnés', earned: false, progress: 23 },
        { id: 4, name: 'Expert IA', icon: '🤖', description: 'Utiliser l\'IA 50 fois', earned: true, date: '10/01/2026' }
    ],

    notifications: [
        { id: 1, type: 'like', user: 'Marie D.', content: 'a aimé votre publication', time: '5 min', read: false },
        { id: 2, type: 'comment', user: 'Jean M.', content: 'a commenté votre article', time: '1 h', read: false },
        { id: 3, type: 'follow', user: 'Sophie L.', content: 'a commencé à vous suivre', time: '2 h', read: true },
        { id: 4, type: 'mention', user: 'Pierre R.', content: 'vous a mentionné dans un débat', time: '3 h', read: true }
    ],

    messages: [
        { id: 1, user: 'Alex Martin', avatar: 'https://ui-avatars.com/api/?name=Alex+Martin', lastMessage: 'Salut ! Tu as vu mon dernier article ?', time: '2 min', unread: 2 },
        { id: 2, user: 'Sophie Dubois', avatar: 'https://ui-avatars.com/api/?name=Sophie+Dubois', lastMessage: 'Merci pour ton aide !', time: '1 h', unread: 0 },
        { id: 3, user: 'Forum Tech', avatar: 'https://ui-avatars.com/api/?name=Forum+Tech', lastMessage: 'Nouvelle discussion sur l\'IA', time: '3 h', unread: 5 }
    ],

    aiMessages: [
        { role: 'assistant', content: 'Bonjour ! Je suis votre assistant IA personnel. Comment puis-je vous aider aujourd\'hui ?' }
    ],

    // ============ Lifecycle ============
    init() {
        try {
            const savedUser = localStorage.getItem('igrec_user');
            if (savedUser) {
                this.user = JSON.parse(savedUser);
                this.showAuth = false;
            }
            this.render();
            this.setupEventListeners();
        } catch (error) {
            console.error('Init error:', error);
            this.render();
        }
    },

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
    },

    closeAllModals() {
        this.showMessages = false;
        this.showNotifications = false;
        this.showBadges = false;
        this.showVideoCall = false;
        this.showLiveStream = false;
        this.showAIAssistant = false;
        this.render();
    },

    // ============ Render ============
    render() {
        const app = document.getElementById('app');
        if (!app) return;

        if (this.showAuth) {
            app.innerHTML = this.renderAuth();
        } else if (this.showLiveStream) {
            app.innerHTML = this.renderLiveStream();
        } else if (this.showVideoCall) {
            app.innerHTML = this.renderVideoCall();
        } else if (this.showBadges) {
            app.innerHTML = this.renderBadges();
        } else {
            app.innerHTML = this.renderDashboard();
        }

        if (this.showNotifications) {
            app.innerHTML += this.renderNotifications();
        }
        if (this.showAIAssistant) {
            app.innerHTML += this.renderAIAssistant();
        }
    },

    renderAuth() {
        return `
            <div class="min-h-screen gradient-purple flex items-center justify-center p-4">
                <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-slideIn">
                    <h1 class="text-4xl font-bold text-center mb-2">I-grec</h1>
                    <p class="text-center text-gray-600 mb-8">Réseau Social Nouvelle Génération</p>
                    
                    ${this.step === 'phone' ? `
                        <div class="space-y-4">
                            <input type="tel" placeholder="+33 6 XX XX XX XX" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500" />
                            <button onclick="app.step = 'code'; app.render();" class="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-smooth">Continuer</button>
                        </div>
                    ` : `
                        <div class="space-y-4">
                            <p class="text-sm text-gray-600">Code envoyé à votre numéro</p>
                            <input type="text" placeholder="000000" maxlength="6" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 text-center text-2xl tracking-widest" />
                            <button onclick="app.user = { id: 1, phone: '', displayName: 'Utilisateur', avatar: 'https://ui-avatars.com/api/?name=User' }; app.showAuth = false; localStorage.setItem('igrec_user', JSON.stringify(app.user)); app.render();" class="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-smooth">Vérifier le code</button>
                        </div>
                    `}
                </div>
            </div>
        `;
    },

    renderDashboard() {
        return `
            <div class="min-h-screen bg-gray-50">
                <nav class="bg-white shadow-sm sticky top-0 z-40">
                    <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                        <h1 class="text-2xl font-bold gradient-purple bg-clip-text text-transparent">I-grec</h1>
                        <button onclick="app.showNotifications = !app.showNotifications; app.render();" class="relative p-2 text-gray-600 hover:text-purple-600">
                            🔔
                            ${this.notifications.filter(n => !n.read).length > 0 ? `<span class="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full"></span>` : ''}
                        </button>
                    </div>
                </nav>

                <div class="max-w-7xl mx-auto px-4 py-8">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div class="md:col-span-2 space-y-6">
                            <div class="bg-white rounded-xl shadow-sm p-6">
                                <h2 class="text-2xl font-bold mb-6">Bienvenue, ${this.user?.displayName || 'Utilisateur'}! 👋</h2>
                                <p class="text-gray-600">Votre feed personnalisé apparaîtra ici</p>
                            </div>
                        </div>

                        <div class="space-y-6">
                            <div class="bg-white rounded-xl shadow-sm p-6">
                                <h3 class="font-bold mb-4">🚀 Fonctionnalités</h3>
                                <div class="space-y-2">
                                    <button onclick="app.showBadges = true; app.render();" class="w-full text-left px-4 py-2 rounded-lg hover:bg-purple-50 transition-smooth">🏆 Badges</button>
                                    <button onclick="app.showMessages = true; app.render();" class="w-full text-left px-4 py-2 rounded-lg hover:bg-purple-50 transition-smooth">💬 Messages</button>
                                    <button onclick="app.showAIAssistant = true; app.render();" class="w-full text-left px-4 py-2 rounded-lg hover:bg-purple-50 transition-smooth">🤖 Assistant IA</button>
                                    <button onclick="app.showLiveStream = true; app.render();" class="w-full text-left px-4 py-2 rounded-lg hover:bg-purple-50 transition-smooth">🔴 Live Stream</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    renderNotifications() {
        return `
            <div class="fixed top-16 right-4 bg-white rounded-2xl shadow-2xl w-96 max-h-[600px] overflow-hidden z-50 border border-gray-200 animate-slideIn">
                <div class="p-4 border-b border-gray-200 flex items-center justify-between">
                    <h3 class="font-bold text-lg">Notifications (${this.notifications.filter(n => !n.read).length})</h3>
                    <button onclick="app.showNotifications = false; app.render();" class="text-gray-500 hover:text-gray-700 text-xl">✕</button>
                </div>
                <div class="overflow-y-auto max-h-[520px] divide-y divide-gray-100">
                    ${this.notifications.map(notif => {
                        const icons = { like: '❤️', comment: '💬', follow: '👤', mention: '@' };
                        return `
                            <div class="p-4 hover:bg-gray-50 transition-smooth ${!notif.read ? 'bg-purple-50' : ''}">
                                <div class="flex items-start gap-3">
                                    <span class="text-2xl">${icons[notif.type]}</span>
                                    <div class="flex-1">
                                        <p class="text-sm"><span class="font-semibold">${notif.user}</span> ${notif.content}</p>
                                        <p class="text-xs text-gray-500 mt-1">${notif.time}</p>
                                    </div>
                                    ${!notif.read ? `<span class="w-2 h-2 bg-purple-600 rounded-full mt-1"></span>` : ''}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    },

    renderBadges() {
        const earnedBadges = this.userBadges.filter(b => b.earned);
        return `
            <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div class="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-slideIn">
                    <div class="border-b border-gray-200 p-6 flex items-center justify-between">
                        <h2 class="text-2xl font-bold">🏆 Badges & Récompenses</h2>
                        <button onclick="app.showBadges = false; app.render();" class="text-gray-500 hover:text-gray-700 text-2xl">✕</button>
                    </div>
                    <div class="p-6">
                        <div class="gradient-purple text-white rounded-xl p-6 mb-6">
                            <h3 class="text-xl font-bold mb-2">Niveau 12 - Expert</h3>
                            <div class="flex items-center gap-4">
                                <div class="flex-1 bg-white bg-opacity-30 rounded-full h-3"><div class="bg-white h-3 rounded-full" style="width: 65%"></div></div>
                                <span class="font-semibold">65%</span>
                            </div>
                        </div>
                        <div class="grid md:grid-cols-3 gap-4">
                            ${earnedBadges.map(badge => `
                                <div class="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-xl p-6 text-center hover:scale-105 transition-smooth">
                                    <div class="text-6xl mb-3">${badge.icon}</div>
                                    <h4 class="font-bold text-lg mb-1">${badge.name}</h4>
                                    <p class="text-sm text-gray-600 mb-2">${badge.description}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    renderLiveStream() {
        return `
            <div class="fixed inset-0 bg-gray-900 z-50 flex flex-col">
                <div class="relative h-2/3 bg-gradient-to-br from-purple-900 to-pink-900 flex items-center justify-center">
                    <div class="text-center">
                        <div class="text-6xl mb-4">🎥</div>
                        <h2 class="text-white text-3xl font-bold mb-2">Votre Live Stream</h2>
                        <p class="text-white text-lg">👥 234 spectateurs</p>
                    </div>
                    <button onclick="app.showLiveStream = false; app.render();" class="absolute top-4 right-4 bg-red-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-red-700">Terminer</button>
                </div>
            </div>
        `;
    },

    renderVideoCall() {
        const chat = this.messages.find(m => m.id === this.currentChat) || this.messages[0];
        return `
            <div class="fixed inset-0 bg-gray-900 z-50 flex flex-col">
                <div class="flex-1 relative bg-gradient-to-br from-purple-900 to-pink-900 flex items-center justify-center">
                    <div class="text-center">
                        <img src="${chat.avatar}" alt="" class="w-48 h-48 rounded-full mx-auto mb-4 border-4 border-white shadow-2xl" />
                        <h2 class="text-white text-3xl font-bold mb-2">${chat.user}</h2>
                        <p class="text-white text-lg">Appel vidéo en cours...</p>
                    </div>
                </div>
                <div class="bg-gray-800 p-6 flex justify-center gap-4">
                    <button onclick="app.micMuted = !app.micMuted; app.render();" class="p-4 rounded-full ${this.micMuted ? 'bg-red-600' : 'bg-gray-700'} text-2xl">
                        ${this.micMuted ? '🔇' : '🎤'}
                    </button>
                    <button onclick="app.showVideoCall = false; app.render();" class="p-6 bg-red-600 rounded-full text-3xl">📞</button>
                </div>
            </div>
        `;
    },

    renderAIAssistant() {
        return `
            <div class="fixed bottom-4 right-4 w-96 bg-white rounded-2xl shadow-2xl z-50 flex flex-col animate-slideIn" style="height: 600px">
                <div class="gradient-purple text-white p-4 rounded-t-2xl flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-white rounded-full flex items-center justify-center">🤖</div>
                        <div>
                            <h3 class="font-bold">Assistant IA</h3>
                            <p class="text-xs opacity-90">En ligne</p>
                        </div>
                    </div>
                    <button onclick="app.showAIAssistant = false; app.render();" class="text-2xl">✕</button>
                </div>
                <div class="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                    ${this.aiMessages.map(msg => `
                        <div class="flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}">
                            <div class="${msg.role === 'user' ? 'bg-purple-600 text-white' : 'bg-white'} rounded-2xl px-4 py-3 max-w-[80%] shadow-sm">
                                <p class="text-sm">${msg.content}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
                    <div class="flex items-center gap-2">
                        <input type="text" placeholder="Posez votre question..." class="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-purple-500" />
                        <button class="gradient-purple text-white p-3 rounded-full">➤</button>
                    </div>
                </div>
            </div>
        `;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = App;
}