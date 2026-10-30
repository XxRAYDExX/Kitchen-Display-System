import { useEffect, useState } from "react";
import "./Kitchen.css";

import { db } from "../firebase";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

function generateSessionCode(length = 6) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters[randomIndex];
  }

  return code;
}

function Kitchen() {

    const [sessionCode] = useState(() => {
        const saved = localStorage.getItem("sessionCode");

        if (saved) {
            return saved;
        }

        const newCode = generateSessionCode();
        localStorage.setItem("sessionCode", newCode);

        return newCode;
    });

    const [orders, setOrders] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "sessions", sessionCode, "orders"),
      orderBy("orderNumber")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const firebaseOrders = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setOrders(firebaseOrders);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="kitchen-container">

      <div className="kitchen-header">
        <div>
          <h1>🍽 Kitchen Display System</h1>
          <p>Live Orders</p>
        </div>

        <div className="session-card">
            <h3>Session Code: {sessionCode}</h3>
        </div>

        <div className="order-counter">
          <span className="order-count">{orders.length}</span>
          <span className="order-label">Active Orders</span>
        </div>
      </div>

      <div className="ticket-rail">

        {orders.map((order) => (
          <div className="ticket" key={order.id}>

            <div className="ticket-header">
              <h3>Order #{order.orderNumber}</h3>
              <small>{order.time}</small>
            </div>

            <hr />

            <div className="ticket-section">
              <h4>Table</h4>
              <p>{order.tableNumber || "--"}</p>
            </div>

            <div className="ticket-section">
              <h4>Items</h4>
              <pre>{order.items || "No items"}</pre>
            </div>

            <div className="ticket-section">
              <h4>Special Instructions</h4>
              <pre>{order.notes || "None"}</pre>
            </div>

            {order.image && (
              <img
                src={order.image}
                alt="Order"
                className="ticket-image"
              />
            )}

          </div>
        ))}

      </div>

    </div>
  );
}

export default Kitchen;