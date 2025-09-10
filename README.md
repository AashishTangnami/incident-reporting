# bun-react-tailwind-shadcn-template

To install dependencies:

```bash
bun install
```

To start a development server:

```bash
bun dev
```

To run for production:

```bash
bun start
```

This project was created using `bun init` in bun v1.2.18. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

# Incident Reporting & Monitoring System (MVP)

This is a mobile-first incident reporting and monitoring system.  
The system allows users to report incidents happening in their area, optionally attach media, and track the status of their reports. Admins can monitor incidents on a web dashboard, manage dispatch, and notify users when issues are resolved.

---

## 👤 User Features

1. **Report Incidents**
   - Select the type of incident (fire, violence, medical, traffic, other).  
   - Enter a description of the incident in a text area.  
   - Specify location:  
     - Auto GPS capture  
     - Or manually select major intersection, chowk, or area of conflict.  

2. **Attach Media**
   - Upload photos or videos directly from device or gallery.  

3. **Ticket Management**
   - Receive a **ticket ID** after submission.  
   - Track ticket status: Pending → In Progress → Under Control.  
   - Get notified when an issue is marked as **Under Control**.  

4. **Security & Privacy**
   - Authentication for users.  
   - Incident data and media stored securely.  

---

## 🖥️ Admin / Monitoring Features

1. **Dashboard**
   - Map view of all incidents reported.  
   - Incident list feed with filters and details (type, description, media).  

2. **Incident Management**
   - Locate areas of conflict/interest quickly.  
   - Change status of incidents (Pending → In Progress → Under Control).  
   - View how many areas are under control vs pending.  

3. **Dispatch Management**
   - Assign incidents to safety/dispatch units.  
   - Notify users when an incident has been resolved.  

4. **Summary & Metrics**
   - Track counts of incidents per status.  
   - Visual indicators of high-priority/conflict areas.  

5. **Security**
   - Admin authentication and role-based access.  
   - Only authorized admins can update incident statuses or dispatch units.  

---

## 📁 Project Structure (Suggested)



