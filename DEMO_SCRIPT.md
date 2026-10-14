# PlayMate — 4-minute Loom walkthrough

**Before recording:** run `npm run build && npm run preview`, open the app at 1280px, and click **Reset demo data** in the footer so you start from a clean state. Keep a second browser tab open on the same venue for the double-booking moment.

---

### 0:00 – 0:20 · Intro
> "This is PlayMate, a frontend-only app for booking sports venues and finding players. It's React, TypeScript, Tailwind and Zustand. All data persists in localStorage. I'll walk through the five player screens, then the extras I added, including a venue-owner mode."

### 0:20 – 0:55 · Home: search, filters, sort
- Reload to show the **loading skeletons**.
- Type **"HSR"** in search, then clear it.
- Select **Cricket**, then **Tennis**: "Sport is multi-select."
- Drag **Max price** down to ₹1,000, then **Max distance** down: "Every filter combines and updates live."
- Type **"zzz"** to get the **empty state**, then click **Reset filters**.
- Change sort to **Price: low to high**.
- **Heart** Hoops Hub, then turn on **Saved venues only** (*extra: favourites*).

### 0:55 – 1:45 · Venue details and booking
- Open **Kickoff Arena**. Show the carousel arrows and thumbnails, the amenities, and **Open in Maps**.
- Point at the **date strip** "N free" counts. Choose tomorrow.
- "Struck-through slots are already booked and disabled." Select **two slots**, and the **price summary** updates live.
- **Book**, then the **confirmation modal**, then **Confirm & pay**, then the **success** screen.
- Click **Copy link** and **Add to calendar** to show the toast and the `.ics` download (*extra: share booking*).
- Switch to the **second tab** and select the same date: "Those slots are already shown as your booking. Double booking is blocked across tabs, and re-checked in the store before saving."

### 1:45 – 2:15 · My Bookings
- Click **Bookings** in the nav and point at the **upcoming badge**.
- **Cancel** the new booking, go through the confirm dialog, and show the toast. Click **Undo**, then cancel again.
- "The slot is free again." Optionally show the venue page.
- Open the **Past** tab: "Cancelled and completed bookings, each with **Book again**." Click it to jump straight to the slot picker.

### 2:15 – 2:50 · Find Players
- Filter by **Badminton**, then **All sports**. Turn on **Beginner friendly only** (*extra: skill tags*).
- Click **Join**. It changes to **Request sent** and shows a toast. Refresh the page: "It's persisted."
- Click **Post a game**, then submit the empty form to show **validation**.
- Link an upcoming booking: "Venue and time fill in automatically, and it shows the **cost per player**." Post it, and it appears **at the top** with "₹ per player" (*extra: split-the-cost*).

### 2:50 – 3:10 · Profile
- Show the stat tiles and the **games per sport** and **games per month** charts. Hover a bar to show the tooltip.
- **Edit profile**: change the name and avatar colour, add Tennis, then **Save**, and a toast confirms.

### 3:10 – 3:45 · Venue Owner mode (*extra*)
- Flip the **Player/Owner** toggle in the nav, which opens the dashboard and swaps the nav.
- "Today's slots booked, revenue and occupancy, plus occupancy per venue."
- Select Kickoff Arena, pick a date, and **block** an open slot (toast). "Players can no longer book it." Open **View listing** to show it as Unavailable.
- **Add venue**: fill the form, publish, and it's live on Explore with a **New** badge.
- Flip back to Player mode.

### 3:45 – 4:00 · Polish and wrap-up
- Toggle **dark mode** and refresh: "It's persisted, with no flash."
- Resize to mobile width to show the **bottom tab nav** and the filters sheet.
- Visit `/nope` to show the **404** page.
> "Code is organised by domain, with a service layer ready for a real API. The README covers state decisions and next steps. Thanks for watching!"
