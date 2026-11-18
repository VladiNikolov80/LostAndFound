# LostAndFound

A mobile app for lost and found things. If you lost something, you post it as **Lost**. If you found something, you post it as **Found**. Other people can look through the posts and contact you.

## Download (APK)

**[Download LostAndFound.apk](https://github.com/VladiNikolov80/LostAndFound/releases/latest/download/LostAndFound.apk)** (Android)

The link always points to the newest version in [Releases](https://github.com/VladiNikolov80/LostAndFound/releases). To install it, open the link on an Android phone and allow "Install unknown apps" for your browser when Android asks.

## Test accounts

You can log in with one of these accounts or register a new one.

| Email | Password |
| --- | --- |
| test@test.com | 123456 |
| test1@test1.com | 123456 |

With two accounts you can see the difference between your own posts and other people's posts: on your own post you can Edit, Mark as returned and Delete, and on someone else's post you can only contact the author.

## Tech stack

- **React Native** with **Expo** (SDK 58)
- **React Navigation** – bottom tabs with stacks inside them
- **Firebase** – Authentication and Firestore (free Spark plan)
- **Cloudinary** – stores the photos (free plan)
- **expo-image-picker**, **expo-location** and **expo-file-system** – camera, gallery, GPS and photo upload

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
  services/     itemsService and commentsService (Firestore), uploadImage (Cloudinary), location (GPS)
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
- I also protected the data in **Firestore Security Rules**, not only in the app. Only logged-in users can read posts. A user can create a post only with their own id, and can edit or delete **only their own** posts. Each user can write only their own profile in `users`. A comment can be written only with your own id and must be 1–500 characters, and it can be deleted only by its author or by the author of the post.

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
- If you are the author, you see Edit, Mark as returned and Delete. If not, you see a button that opens your email app with the author's address and the post title already filled in – this is for **private** contact (for example to give your phone number).

**Comments**
- Under every post there is a **public comments** section, for example "I think I saw it at the bus stop". The author of the post can answer there, and their comments are marked "author of the post".
- The comments come in **real time** with Firestore's `onSnapshot()`: when someone writes a comment, it appears on everybody's screen without refreshing. When you leave the screen, the app stops listening (`unsubscribe`).
- Everyone can delete their own comments. The author of the post can delete all comments under it (for example spam).
- A comment can't be empty and can be at most 500 characters.

### 6. Data Source & Backend

**Backend Type:** Real backend – Firebase (Backend-as-a-Service). Firebase Authentication takes care of the users and Cloud Firestore stores the data. I don't have my own server.

**Collections**
- `users/{uid}` – name, email, createdAt
- `items/{itemId}` – type (`lost` / `found`), title, category, description, place, location (`{ latitude, longitude }` or `null`), eventDate, reward, imageUrls, status (`active` / `resolved`), ownerId, ownerName, ownerEmail, createdAt, updatedAt

- `items/{itemId}/comments/{commentId}` – text, authorId, authorName, createdAt (a subcollection of the post)

**Photos:** Firebase Storage needs a paid plan for new projects, so I store the photos in **Cloudinary** (free plan). The app uploads each photo to Cloudinary and saves only the photo's web address in `imageUrls` in Firestore.

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
- Only the author sees the Delete button. The app asks for confirmation (`Alert`), then calls `deleteItem(id)` and goes back to the list, which reloads without the deleted post.
- Firestore doesn't delete subcollections by itself, so `deleteItem()` first deletes all comments of the post and then the post (`deleteDoc()`).

**Comments**
- Create: `addComment()` (`addDoc()` in `items/{itemId}/comments`). Read: `subscribeToComments()` (`onSnapshot()`, real time). Delete: `deleteComment()`.
- The Firestore rules also check that only the author can update or delete, so it is protected even outside the app.

### 8. Forms & Validation

**Forms Used:** Login, Register, New post, Edit post. New post and Edit post use the same component, `ItemForm`, so the rules are the same in both.

**Input types (not only text)**
- **Lost / Found** – two big buttons, only one can be selected.
- **Category** – chips (Keys, Wallets, Phones…), you tap one.
- **Date picker** – "When did you lose / find it?" (`@react-native-community/datetimepicker`). On Android it opens the system date window, on iPhone it shows the small inline picker. You can't choose a date in the future (`maximumDate`).
- **Switch** – "I offer a reward". It shows only for Lost posts, because for Found posts it makes no sense. If it is on, the details screen shows a reward note.

**Validation Rules**
- **Title** – this field has more than one rule: it is required, at least 3 characters and at most 60 characters. I trim it first, so a title with only spaces is not accepted.
- **Category** – required.
- **Description** – at least 10 characters.
- **Place** – required.
- **Date** – required and not in the future.
- **Register:** name at least 2 characters; email required and in a valid format; password required, at least 6 characters, and both passwords must be the same.
- Every error is shown in red under its own field, and the field gets a red border, so you know exactly what to fix.

**Keyboard, Safe Area & Status Bar**
- The forms are inside `KeyboardAvoidingView` + `ScrollView`, so the keyboard never covers the field you are typing in. You can always scroll to the button.
- On Android this needed an extra fix. Expo apps on Android are edge-to-edge, so the window doesn't get smaller when the keyboard opens, and at first the keyboard covered the Description field. I set `behavior="padding"` and passed the header height (`useHeaderHeight()`) as `keyboardVerticalOffset`, so the form moves up exactly above the keyboard. On iPhone the `ScrollView` does it by itself with `automaticallyAdjustKeyboardInsets`.
- The bottom tabs hide while the keyboard is open (`tabBarHideOnKeyboard`), so there is more space for the form.
- `SafeAreaProvider` wraps the app and the login screens use `SafeAreaView`, so nothing goes under the notch or the clock. The screens with a header get the safe area from React Navigation.
- `StatusBar` from `expo-status-bar` is set to dark text, because the app background is light.

### 9. Native Device Features

The app uses two features of the phone, and both have a real job in the app.

**Camera & Gallery** (`expo-image-picker`)
- In the New post and Edit forms you can add up to **3 photos** of the item: **Take photo** opens the camera, **Gallery** opens your photos. You can crop the photo and remove it with the small "x".
- Before opening the camera the app asks for permission. If you say no, you get a message how to allow it in the phone settings.
- Photos are compressed (`quality: 0.6`) so they upload faster.
- When you save the post, the new photos are uploaded to Cloudinary (`uploadImage()`), and the post saves their addresses. When you edit a post, the old photos are not uploaded again.
- For the upload I use `File.upload()` from `expo-file-system` (multipart upload to an unsigned Cloudinary preset). At first I sent the photo with `fetch` and `FormData` like `{ uri, type, name }`, but in Expo SDK 58 the built-in `fetch` doesn't support this anymore and gave "Unsupported FormDataPart implementation". With `File.upload()` the phone sends the file by itself.
- The list shows a small version of the first photo, and the details screen shows all photos – you swipe left and right. Cloudinary makes the small versions for me: I just add the size to the photo address (`resizedImageUrl()`).
- Why it matters: with a photo people can recognize their thing much faster than from a text.

**Location / GPS** (`expo-location`)
- Under the Place field there is a button **"Use my current location"**. It asks for permission, gets the GPS position and turns it into an address (`reverseGeocodeAsync`), for example "Vitosha Blvd 1, Sofia". The address goes into the Place field and the coordinates are saved in the post.
- If you change the address by hand, the GPS coordinates are removed, because they would not match the new address anymore.
- On the details screen, posts with coordinates have **"Open in maps"**. It opens Apple Maps on iPhone or the maps app on Android with the exact point.
- Why it matters: when you find something on the street, you can mark the exact place in one tap, and the owner sees exactly where it was.

**Permissions**
- The permission texts are in `app.json` (config plugins for `expo-image-picker` and `expo-location`), so the phone shows a clear reason when it asks.

### 10. Typical User Flow

**Someone lost their keys**
1. Opens the app and registers (or logs in with a test account).
2. Goes to the **New** tab, chooses **I lost something**, takes a photo of a similar key ring or picks one from the gallery, writes a title and description, chooses the category **Keys**, sets the date and taps **Use my current location**. Turns on **I offer a reward**.
3. Taps **Publish**. The app uploads the photo, saves the post and opens it.
4. Later, in **My posts**, they see their post. When the keys are back, they open the post and tap **Mark as returned**. The badge turns grey.

**Someone found the keys**
1. Logs in with another account and scrolls the **Posts** list, or uses the **Lost** filter.
2. Sees the post with the photo, opens it, checks the place with **Open in maps**.
3. Taps **I found it – write to the author**, and the email app opens with the author's address and the post title.

**After that**
- Pull down on the list to refresh it.
- Close the app and open it again – you are still logged in.
- **Profile → Log out** brings you back to the Login screen.

### 11. Error & Edge Case Handling

**Loading and errors**
- Every screen that loads data shows a spinner while it loads.
- If the posts can't be loaded (for example no internet), the list shows a message and a **Try again** button instead of crashing.
- If a post was deleted in the meantime, the details screen shows "This post doesn't exist".
- Login and register errors from Firebase are shown as readable messages (wrong password, email already used, too many tries, no internet).

**Forms**
- Invalid fields are shown in red with a message, and nothing is sent to Firebase until everything is valid.
- While saving, the button shows a spinner and is disabled, so you can't send the same post twice.
- If a photo can't be uploaded, the post is **not** saved and you see the reason. The form keeps everything you typed, so you can just try again.

**Permissions**
- If you don't allow the camera or the location, the app shows a message how to allow it in the settings and keeps working. Photos and GPS are optional.
- If GPS works but the address can't be found, the app fills in the coordinates instead.

**Security**
- You can't edit someone else's post, even if you open the Edit screen directly – the screen checks the owner and shows a message. The Firestore rules block it too.
- Deleting asks for confirmation first.
- Old posts made before the date and photo features still work: without a date the app shows the publish date, and without photos it shows an icon.
