export type Language = 'ko' | 'en' | 'ja' | 'zh';

export const translations = {
  ko: {
    // 공통
    login: '로그인',
    logout: '로그아웃',
    register: '회원가입',
    email: '이메일',
    password: '비밀번호',
    username: '사용자명',
    loading: '로딩 중...',
    cancel: '취소',
    confirm: '확인',
    copy: '복사',
    name: '이름',
    
    // 로그인
    loginTitle: 'Talk It',
    loginDescription: '로그인하여 채팅을 시작하세요',
    loginButton: '로그인',
    loggingIn: '로그인 중...',
    orDivider: '또는',
    chatAnonymously: '익명으로 채팅하기',
    alreadyHaveAccount: '이미 계정이 있으신가요?',
    dontHaveAccount: '계정이 없으신가요?',
    demoAccount: '데모 계정: user1@example.com / 비밀번호: 아무거나',
    
    // 회원가입
    registerTitle: '회원가입',
    registerDescription: '새 계정을 만들어 Talk It을 시작하세요',
    registerButton: '회원가입',
    registering: '가입 중...',
    confirmPassword: '비밀번호 확인',
    
    // 공개 채팅방
    publicChatTitle: 'Talk It - 공개 채팅방',
    publicChatDescription: '누구나 참여할 수 있는 공간',
    privateRooms: '비공개 방',
    loggedInUser: '로그인 사용자',
    anonymous: '익명',
    noMessages: '아직 메시지가 없습니다.',
    firstMessage: '첫 메시지를 보내보세요!',
    messagePlaceholder: '메시지를 입력하세요...',
    namePlaceholder: '이름',
    
    // 비공개 방
    privateRoomsTitle: '비공개 채팅방',
    privateRoomsDescription: '초대받은 사람만 참여 가능',
    createNewRoom: '새 방 만들기',
    joinWithCode: '초대 코드로 참여',
    createRoomTitle: '새 비공개 방 만들기',
    createRoomDescription: '방 이름을 입력하고 초대 코드를 받으세요',
    roomName: '방 이름',
    roomNamePlaceholder: '친구들과의 채팅',
    creating: '생성 중...',
    createRoom: '방 만들기',
    joinRoomTitle: '비공개 방 참여',
    joinRoomDescription: '받은 초대 코드를 입력하세요',
    inviteCode: '초대 코드',
    inviteCodePlaceholder: 'ABC123',
    joining: '참여 중...',
    joinRoom: '참여하기',
    noRooms: '참여 중인 비공개 방이 없습니다',
    noRoomsDescription: '새 방을 만들거나 초대 코드로 참여해보세요',
    members: '멤버',
    enter: '입장',
    inviteLink: '초대 링크',
    
    // 비공개 채팅
    roomNotFound: '방을 찾을 수 없습니다.',
    backToRoomList: '방 목록으로 돌아가기',
    
    // 프로필
    myProfile: '내 정보',
    talkItUser: 'Talk It 사용자',
    joinedDate: '가입일',
    managePrivateRooms: '비공개 채팅방 관리',
    goToPublicChat: '공개 채팅방으로 이동',
    
    // 메시지
    roomCreated: '비공개 방이 생성되었습니다!',
    roomJoined: '방에 참여했습니다!',
    inviteCodeCopied: '초대 코드가 복사되었습니다!',
    inviteLinkCopied: '초대 링크가 복사되었습니다!',
    
    // 에러
    loginError: '이메일 또는 비밀번호가 일치하지 않습니다.',
    registerError: '회원가입에 실패했습니다.',
    emailExists: '이미 존재하는 이메일입니다.',
    passwordMismatch: '비밀번호가 일치하지 않습니다.',
    passwordTooShort: '비밀번호는 최소 6자 이상이어야 합니다.',
    createRoomError: '방 생성에 실패했습니다.',
    joinRoomError: '방 참여에 실패했습니다.',
    invalidInviteCode: '존재하지 않는 초대 코드입니다.',
  },
  
  en: {
    // Common
    login: 'Login',
    logout: 'Logout',
    register: 'Sign Up',
    email: 'Email',
    password: 'Password',
    username: 'Username',
    loading: 'Loading...',
    cancel: 'Cancel',
    confirm: 'Confirm',
    copy: 'Copy',
    name: 'Name',
    
    // Login
    loginTitle: 'Talk It',
    loginDescription: 'Login to start chatting',
    loginButton: 'Login',
    loggingIn: 'Logging in...',
    orDivider: 'or',
    chatAnonymously: 'Chat Anonymously',
    alreadyHaveAccount: 'Already have an account?',
    dontHaveAccount: "Don't have an account?",
    demoAccount: 'Demo account: user1@example.com / Password: anything',
    
    // Register
    registerTitle: 'Sign Up',
    registerDescription: 'Create a new account to start Talk It',
    registerButton: 'Sign Up',
    registering: 'Signing up...',
    confirmPassword: 'Confirm Password',
    
    // Public Chat
    publicChatTitle: 'Talk It - Public Chat',
    publicChatDescription: 'Open space for everyone',
    privateRooms: 'Private Rooms',
    loggedInUser: 'Logged in',
    anonymous: 'Anonymous',
    noMessages: 'No messages yet.',
    firstMessage: 'Send the first message!',
    messagePlaceholder: 'Type a message...',
    namePlaceholder: 'Name',
    
    // Private Rooms
    privateRoomsTitle: 'Private Rooms',
    privateRoomsDescription: 'Invite-only spaces',
    createNewRoom: 'Create New Room',
    joinWithCode: 'Join with Code',
    createRoomTitle: 'Create New Private Room',
    createRoomDescription: 'Enter room name and get invite code',
    roomName: 'Room Name',
    roomNamePlaceholder: 'Chat with friends',
    creating: 'Creating...',
    createRoom: 'Create Room',
    joinRoomTitle: 'Join Private Room',
    joinRoomDescription: 'Enter the invite code you received',
    inviteCode: 'Invite Code',
    inviteCodePlaceholder: 'ABC123',
    joining: 'Joining...',
    joinRoom: 'Join',
    noRooms: 'No private rooms joined',
    noRoomsDescription: 'Create a new room or join with an invite code',
    members: 'members',
    enter: 'Enter',
    inviteLink: 'Invite Link',
    
    // Private Chat
    roomNotFound: 'Room not found.',
    backToRoomList: 'Back to room list',
    
    // Profile
    myProfile: 'My Profile',
    talkItUser: 'Talk It User',
    joinedDate: 'Joined',
    managePrivateRooms: 'Manage Private Rooms',
    goToPublicChat: 'Go to Public Chat',
    
    // Messages
    roomCreated: 'Private room created!',
    roomJoined: 'Joined the room!',
    inviteCodeCopied: 'Invite code copied!',
    inviteLinkCopied: 'Invite link copied!',
    
    // Errors
    loginError: 'Email or password is incorrect.',
    registerError: 'Registration failed.',
    emailExists: 'Email already exists.',
    passwordMismatch: 'Passwords do not match.',
    passwordTooShort: 'Password must be at least 6 characters.',
    createRoomError: 'Failed to create room.',
    joinRoomError: 'Failed to join room.',
    invalidInviteCode: 'Invalid invite code.',
  },
  
  ja: {
    // Common
    login: 'ログイン',
    logout: 'ログアウト',
    register: '新規登録',
    email: 'メールアドレス',
    password: 'パスワード',
    username: 'ユーザー名',
    loading: '読み込み中...',
    cancel: 'キャンセル',
    confirm: '確認',
    copy: 'コピー',
    name: '名前',
    
    // Login
    loginTitle: 'Talk It',
    loginDescription: 'ログインしてチャットを始めましょう',
    loginButton: 'ログイン',
    loggingIn: 'ログイン中...',
    orDivider: 'または',
    chatAnonymously: '匿名でチャット',
    alreadyHaveAccount: 'アカウントをお持ちですか？',
    dontHaveAccount: 'アカウントをお持ちでないですか？',
    demoAccount: 'デモアカウント: user1@example.com / パスワード: 何でも',
    
    // Register
    registerTitle: '新規登録',
    registerDescription: '新しいアカウントを作成してTalk Itを始めましょう',
    registerButton: '新規登録',
    registering: '登録中...',
    confirmPassword: 'パスワード確認',
    
    // Public Chat
    publicChatTitle: 'Talk It - 公開チャット',
    publicChatDescription: '誰でも参加できるスペース',
    privateRooms: 'プライベートルーム',
    loggedInUser: 'ログインユーザー',
    anonymous: '匿名',
    noMessages: 'まだメッセージがありません。',
    firstMessage: '最初のメッセージを送信しましょう！',
    messagePlaceholder: 'メッセージを入力...',
    namePlaceholder: '名前',
    
    // Private Rooms
    privateRoomsTitle: 'プライベートルーム',
    privateRoomsDescription: '招待された人のみ参加可能',
    createNewRoom: '新規ルーム作成',
    joinWithCode: '招待コードで参加',
    createRoomTitle: '新しいプライベートルームを作成',
    createRoomDescription: 'ルーム名を入力して招待コードを取得',
    roomName: 'ルーム名',
    roomNamePlaceholder: '友達とのチャット',
    creating: '作成中...',
    createRoom: 'ルームを作成',
    joinRoomTitle: 'プライベートルームに参加',
    joinRoomDescription: '受け取った招待コードを入力',
    inviteCode: '招待コード',
    inviteCodePlaceholder: 'ABC123',
    joining: '参加中...',
    joinRoom: '参加',
    noRooms: '参加中のプライベートルームがありません',
    noRoomsDescription: '新しいルームを作成するか、招待コードで参加してください',
    members: 'メンバー',
    enter: '入室',
    inviteLink: '招待リンク',
    
    // Private Chat
    roomNotFound: 'ルームが見つかりません。',
    backToRoomList: 'ルームリストに戻る',
    
    // Profile
    myProfile: 'プロフィール',
    talkItUser: 'Talk It ユーザー',
    joinedDate: '登録日',
    managePrivateRooms: 'プライベートルーム管理',
    goToPublicChat: '公開チャットへ移動',
    
    // Messages
    roomCreated: 'プライベートルームが作成されました！',
    roomJoined: 'ルームに参加しました！',
    inviteCodeCopied: '招待コードがコピーされました！',
    inviteLinkCopied: '招待リンクがコピーされました！',
    
    // Errors
    loginError: 'メールアドレスまたはパスワードが正しくありません。',
    registerError: '登録に失敗しました。',
    emailExists: 'すでに存在するメールアドレスです。',
    passwordMismatch: 'パスワードが一致しません。',
    passwordTooShort: 'パスワードは6文字以上である必要があります。',
    createRoomError: 'ルームの作成に失敗しました。',
    joinRoomError: 'ルームへの参加に失敗しました。',
    invalidInviteCode: '無効な招待コードです。',
  },
  
  zh: {
    // Common
    login: '登录',
    logout: '登出',
    register: '注册',
    email: '邮箱',
    password: '密码',
    username: '用户名',
    loading: '加载中...',
    cancel: '取消',
    confirm: '确认',
    copy: '复制',
    name: '名称',
    
    // Login
    loginTitle: 'Talk It',
    loginDescription: '登录开始聊天',
    loginButton: '登录',
    loggingIn: '登录中...',
    orDivider: '或',
    chatAnonymously: '匿名聊天',
    alreadyHaveAccount: '已有账号？',
    dontHaveAccount: '还没有账号？',
    demoAccount: '演示账号: user1@example.com / 密码: 任意',
    
    // Register
    registerTitle: '注册',
    registerDescription: '创建新账号开始使用 Talk It',
    registerButton: '注册',
    registering: '注册中...',
    confirmPassword: '确认密码',
    
    // Public Chat
    publicChatTitle: 'Talk It - 公开聊天室',
    publicChatDescription: '所有人都可以参与的空间',
    privateRooms: '私密房间',
    loggedInUser: '已登录用户',
    anonymous: '匿名',
    noMessages: '还没有消息。',
    firstMessage: '发送第一条消息吧！',
    messagePlaceholder: '输入消息...',
    namePlaceholder: '名称',
    
    // Private Rooms
    privateRoomsTitle: '私密房间',
    privateRoomsDescription: '仅受邀者可参与',
    createNewRoom: '创建新房间',
    joinWithCode: '通过邀请码加入',
    createRoomTitle: '创建新私密房间',
    createRoomDescription: '输入房间名称并获取邀请码',
    roomName: '房间名称',
    roomNamePlaceholder: '与朋友聊天',
    creating: '创建中...',
    createRoom: '创建房间',
    joinRoomTitle: '加入私密房间',
    joinRoomDescription: '输入您收到的邀请码',
    inviteCode: '邀请码',
    inviteCodePlaceholder: 'ABC123',
    joining: '加入中...',
    joinRoom: '加入',
    noRooms: '没有加入的私密房间',
    noRoomsDescription: '创建新房间或使用邀请码加入',
    members: '成员',
    enter: '进入',
    inviteLink: '邀请链接',
    
    // Private Chat
    roomNotFound: '找不到房间。',
    backToRoomList: '返回房间列表',
    
    // Profile
    myProfile: '我的信息',
    talkItUser: 'Talk It 用户',
    joinedDate: '加入日期',
    managePrivateRooms: '管理私密房间',
    goToPublicChat: '前往公开聊天室',
    
    // Messages
    roomCreated: '私密房间已创建！',
    roomJoined: '已加入房间！',
    inviteCodeCopied: '邀请码已复制！',
    inviteLinkCopied: '邀请链接已复制！',
    
    // Errors
    loginError: '邮箱或密码不正确。',
    registerError: '注册失败。',
    emailExists: '邮箱已存在。',
    passwordMismatch: '密码不匹配。',
    passwordTooShort: '密码必须至少6个字符。',
    createRoomError: '创建房间失败。',
    joinRoomError: '加入房间失败。',
    invalidInviteCode: '无效的邀请码。',
  },
};

export const languageNames: Record<Language, string> = {
  ko: '한국어',
  en: 'English',
  ja: '日本語',
  zh: '中文',
};
