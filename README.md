# LostAndFound

A mobile app for lost and found things. If you lost something, you post it as **Lost**. If you found something, you post it as **Found**. Other people can look through the posts and contact you.

## Download (APK)

The Android build (APK) will be added here before the deadline.

## Tech stack

- **React Native** with **Expo** (SDK 58)
- **React Navigation** – bottom tabs with stacks inside them
- **Firebase** – Authentication and Firestore (free Spark plan)
- **Cloudinary** – for the photos *(coming soon)*

## Running the project locally

You need **Node.js 20 or newer** and the **Expo Go** app on your phone.

```bash
git clone https://github.com/VladiNikolov80/LostAndFound.git
cd LostAndFound
npm install
npx expo start
```

Scan the QR code with Expo Go (Android) or with the camera (iPhone).

If your phone can't connect (for example when you work in a virtual machine), use the tunnel:

```bash
npx expo start --tunnel
```

## Project structure

```
src/
  components/   reusable parts (buttons, inputs, post card, list, form)
  config/       Firebase setup
  constants/    colors and categories
  context/      AuthContext – who is logged in
  hooks/        useItemsLoader – loading, refreshing and errors for the lists
  navigation/   all navigators (auth stack, tabs, stacks inside the tabs)
  screens/      the screens, grouped by feature (auth, items, map, profile)
  services/     itemsService – all Firestore calls for the posts
  utils/        small helpers (error messages, date format)
```

## Functional Guide

### 1. Project Overview

**Application Name:** LostAndFound

**Application Category / Topic:** Lost and found posts (classifieds).

**Main Purpose:** When people lose something, they usually post about it in random Facebook groups, and the person who found it never sees the post. I wanted one simple app only for this. You choose if you **lost** or **found** something, add a photo, a short description and the place where it happened. Other users can browse the posts, see them on a map and contact you. When the thing is back with its owner, you mark the post as returned.

### 2. User Access & Permissions

**Guest (Not Authenticated)**
- A guest sees only two screens: **Login** and **Register**. The rest of the app is not even in the navigation until you log in.

**Authenticated User**
- A logged-in user sees the whole app: Posts, Map, New post, My posts and Profile.
- I also protected the data in **Firestore Security Rules**, not only in the app. Only logged-in users can read posts. A user can create a post only with their own id, and can edit or delete **only their own** posts. Each user can write only their own profile in `users`.

### 3. Authentication & Session Handling

**Authentication Flow**
- I use **Firebase Authentication** with email and password.
- When the app starts, `AuthProvider` listens to Firebase's `onAuthStateChanged`. Until the first answer comes, the app shows only a loading spinner. I did this so the Login screen doesn't flash for a second when you are already logged in.
- When someone registers, Firebase creates the user and I save their name as `displayName` with `updateProfile()`. I also save a `users/{uid}` document in Firestore (name, email, createdAt). Then the user goes straight into the app.
- I don't navigate by hand after login or register. `RootNavigator` sees that there is a user now and shows the tabs instead of the login screens. On logout it is the opposite.
- Firebase error codes (wrong password, email already used, no internet) are turned into readable Bulgarian messages with `getAuthErrorMessage()`.

**Session Persistence**
- On a phone Firebase does not remember the user by itself, like it does in the browser. So in `src/config/firebase.js` I start Auth with `initializeAuth` and `getReactNativePersistence(AsyncStorage)`. This saves the session on the phone.
- Because of this, if you close the app and open it again, you are still logged in (auto-login). I don't store any token myself – Firebase does it.

### 4. Navigation Structure

**Main idea**
- If you are not logged in, the app shows only the **Login** and **Register** screens. After you log in, these screens disappear and you see the main app. I did this in `RootNavigator`: it checks if there is a user and shows either `AuthStack` or `AppTabs`.

**Navigators**
- `AuthStack` – a stack with Login and Register.
- `AppTabs` – the bottom tabs: Posts, Map, New, My posts, Profile.
- `ItemsStack` – a stack **inside** the Posts tab: list → details → edit.
- `MyItemsStack` – a stack **inside** the My posts tab: my posts → details → edit.

So there are navigators inside other navigators: the stacks are inside the tabs. The tabs that have their own stack hide the tab header, so you don't see two headers on top of each other.

**Screens**
- 9 screens: Login, Register, Posts list, Post details, Edit post, New post, Map, My posts, Profile.

**Screens with a parameter**
- Post details and Edit post get the post's id as a route parameter (`itemId`) and read it with `route.params`.

### 5. List → Details Flow

**Posts List**
- The Posts screen loads all posts from Firestore with `getItems()`, newest first (by `createdAt`), and shows them in a `FlatList` as `ItemCard`s.
- Each card has a colored badge: orange for **Lost**, blue for **Found**, grey for **Returned**.
- Above the list there is a filter: All / Lost / Found. It filters the posts that are already loaded, so it is instant.
- **Pull-to-refresh:** when you pull the list down, it loads the posts again (`RefreshControl`).
- The list also reloads by itself every time you come back to the screen (`useFocusEffect`). I did this so a new, edited or deleted post shows up right away.
- While loading you see a spinner. If loading fails, you see a message and a "Try again" button. If there are no posts, you see "No posts yet".
- The My posts tab uses the same list, but only with your posts (`getMyItems(uid)`).

**Details Screen**
- When you tap a card, the app opens `ItemDetails` and passes the post's id as a route parameter: `navigation.navigate('ItemDetails', { itemId })`.
- The screen reads the id from `route.params` and loads only that post with `getItemById(itemId)`.
- If you are the author, you see Edit, Mark as returned and Delete. If not, you see a button that opens your email app with the author's address and the post title already filled in.

### 6. Data Source & Backend

**Backend Type:** Real backend – Firebase (Backend-as-a-Service). Firebase Authentication takes care of the users and Cloud Firestore stores the data. I don't have my own server.

**Collections**
- `users/{uid}` – name, email, createdAt
- `items/{itemId}` – type (`lost` / `found`), title, category, description, place, status (`active` / `resolved`), ownerId, ownerName, ownerEmail, createdAt, updatedAt

All Firestore calls are in one file, `src/services/itemsService.js`, so the screens don't talk to Firestore directly.

### 7. Data Operations (CRUD)

**Create (POST)**
- On the New tab the user fills in the form. After validation, `createItem()` calls Firestore's `addDoc()`. I also save `ownerId`, `ownerName`, `ownerEmail`, `status: 'active'` and server timestamps. After saving, the app opens the new post in the Posts tab and clears the form.

**Read (GET)**
- `getItems()` (all posts), `getMyItems(uid)` (only mine) and `getItemById(id)` (one post). They use `getDocs` and `getDoc`.

**Update (PATCH)**
- The Edit screen loads the post and fills the same form with its data. It works only if you are the author; otherwise it says you can edit only your own posts.
- Saving calls `updateItem(id, data)`, which uses `updateDoc()` and changes only the fields from the form. Then you go back to the details, which load the post again.
- **Mark as returned** is also an update: `setItemStatus(id, 'resolved')`. You can activate the post again the same way.

**Delete**
- Only the author sees the Delete button. The app asks for confirmation (`Alert`), then calls `deleteItem(id)` (`deleteDoc()`) and goes back to the list, which reloads without the deleted post.
- The Firestore rules also check that only the author can update or delete, so it is protected even outside the app.

### 8. Forms & Validation

*Will be filled in with the New post form.*

### 9. Native Device Features

*Will be filled in with the camera and location step.*

### 10. Typical User Flow

*Will be filled in at the end.*

### 11. Error & Edge Case Handling

*Will be filled in at the end.*
