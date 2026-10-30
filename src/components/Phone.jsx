import { useState, useEffect } from "react";
import "./Phone.css";

import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

function Phone() {
  const [tableNumber, setTableNumber] = useState("");
  const [items, setItems] = useState("");
  const [notes, setNotes] = useState("");
  const [image, setImage] = useState(null);

  const [sessionCode, setSessionCode] = useState("");
  const [connected, setConnected] = useState(false);

  const [dragStartY, setDragStartY] = useState(null);
  const [translateY, setTranslateY] = useState(0);

  const handleImage = (event) => {
    const file = event.target.files[0];

    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const connectToSession = () => {
    if (sessionCode.trim() === "") return;

    setConnected(true);
  };

  const sendOrder = async () => {
    if (
      tableNumber.trim() === "" &&
      items.trim() === "" &&
      notes.trim() === "" &&
      !image
    ) {
      return;
    }

    const newOrder = {
      orderNumber: Date.now(),
      tableNumber,
      items,
      notes,
      image,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    try {
      await addDoc(
        collection(db, "sessions", sessionCode, "orders"),
        newOrder
      );

      setTableNumber("");
      setItems("");
      setNotes("");
      setImage(null);
    } catch (error) {
      console.error(error);
      alert("Failed to send order.");
    }
  };

  const handleMouseDown = (event) => {
    setDragStartY(event.clientY);
  };

  const handleMouseMove = (event) => {
    if (dragStartY === null) return;

    const distance = event.clientY - dragStartY;

    if (distance < 0) {
      setTranslateY(distance);
    }
  };

  const handleMouseUp = () => {
    if (translateY < -150) {
      sendOrder();
    }

    setTranslateY(0);
    setDragStartY(null);
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <div className="phone-frame">
      <div className="phone-notch"></div>

      <div className="phone-container">
        {!connected ? (
          <>
            <div className="app-header">
              <h2>🍽 Waiter App</h2>
            </div>

            <div className="content">
              <div className="section">
                <h3>Enter Session Code</h3>

                <input
                  className="phone-input"
                  type="text"
                  placeholder="e.g. AB7KQX"
                  value={sessionCode}
                  onChange={(e) =>
                    setSessionCode(e.target.value.toUpperCase())
                  }
                />

                <br />
                <br />

                <button
                  className="send-button"
                  onClick={connectToSession}
                >
                  Connect
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="app-header">
              <h2>🍽 Waiter App</h2>
              <p>Connected to: {sessionCode}</p>
            </div>

            <div className="content">
              {/* Table Number */}
              <div className="section">
                <h3>Table Number</h3>

                <input
                  className="phone-input"
                  type="text"
                  placeholder="e.g. 4"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                />
              </div>

              {/* Items */}
              <div className="section">
                <h3>Items</h3>

                <textarea
                  className="phone-textarea"
                  placeholder={`2x Burger
1x Coke`}
                  rows={5}
                  value={items}
                  onChange={(e) => setItems(e.target.value)}
                />
              </div>

              {/* Notes */}
              <div className="section">
                <h3>Special Instructions</h3>

                <textarea
                  className="phone-textarea"
                  placeholder="No onions"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              {/* Image Upload */}
              <label className="image-button">
                📷 Attach Image

                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImage}
                />
              </label>

              {/* Preview */}
              <div className="section">
                <h3>Preview</h3>

                <div
                  className="preview-card"
                  onMouseDown={handleMouseDown}
                  style={{
                    transform: `translateY(${translateY}px)`,
                    transition: dragStartY
                      ? "none"
                      : "transform 0.25s ease",
                    cursor: "grab",
                  }}
                >
                  <div className="preview-header">
                    <span className="preview-order">
                      Order Preview
                    </span>

                    <span>
                      {new Date().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <hr />

                  <h4>Table</h4>
                  <p>{tableNumber || "--"}</p>

                  <h4>Items</h4>
                  <pre>{items || "No items added"}</pre>

                  <h4>Special Instructions</h4>
                  <pre>{notes || "None"}</pre>

                  {image && (
                    <img
                      src={image}
                      alt="Preview"
                      className="preview-image"
                    />
                  )}
                </div>

                <p className="swipe-hint">
                  ↑ Drag this card upward to send
                </p>
              </div>
            </div>

            <div className="bottom-bar">
              <button
                className="send-button"
                onClick={sendOrder}
              >
                Send Order
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Phone;