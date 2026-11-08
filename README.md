# LostAndFound

A mobile app for lost and found things. If you lost something, you post it as **Lost**. If you found something, you post it as **Found**. Other people can look through the posts and contact you.

## Download (APK)

The Android build (APK) will be added here before the deadline.

## Tech stack

- **React Native** with **Expo** (SDK 58)
- **React Navigation** – bottom tabs with stacks inside them
- **Firebase** – Authentication and Firestore *(coming soon)*
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
  components/   reusable parts (buttons, placeholder screen)
  constants/    colors
  context/      AuthContext – who is logged in
  navigation/   all navigators (auth stack, tabs, stacks inside the tabs)
  screens/      the screens, grouped by feature (auth, items, map, profile)
```

## Functional Guide

### 1. Project Overview

**Application Name:** LostAndFound

**Application Category / Topic:** Lost and found posts (classifieds).

**Main Purpose:** When people lose something, they usually post about it in random Facebook groups, and the person who found it never sees the post. I wanted one simple app only for this. You choose if you **lost** or **found** something, add a photo, a short description and the place where it happened. Other users can browse the posts, see them on a map and contact you. When the thing is back with its owner, you mark the post as returned.

### 2. User Access & Permissions

*Will be filled in after the login step.*

### 3. Authentication & Session Handling

*Will be filled in after the login step.*

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

*Will be filled in when the posts come from Firestore.*

### 6. Data Source & Backend

*Will be filled in when Firebase is connected.*

### 7. Data Operations (CRUD)

*Will be filled in when Firebase is connected.*

### 8. Forms & Validation

*Will be filled in with the New post form.*

### 9. Native Device Features

*Will be filled in with the camera and location step.*

### 10. Typical User Flow

*Will be filled in at the end.*

### 11. Error & Edge Case Handling

*Will be filled in at the end.*
