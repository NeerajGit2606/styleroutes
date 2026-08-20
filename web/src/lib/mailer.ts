import nodemailer from "nodemailer";
import { money } from "@/lib/products";
import { SUPPORT_EMAIL } from "@/lib/config";

type OrderItem = { product: { name: string; price: number }; size: string; quantity: number };
type OrderCustomer = { name: string; phone: string; address: string; city: string; state: string; pincode: string };

const transporter =
  process.env.EMAIL_USER && process.env.EMAIL_APP_PASSWORD
    ? nodemailer.createTransport({
        service: "gmail",
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_APP_PASSWORD },
      })
    : null;

export async function sendOrderNotificationEmail(order: {
  orderNumber: string;
  items: OrderItem[];
  customer: OrderCustomer;
  subtotal: number;
  shipping: number;
  total: number;
}) {
  if (!transporter) return;

  const lines = order.items
    .map((line) => `${line.product.name} (Size ${line.size}) x${line.quantity} — ${money(line.product.price * line.quantity)}`)
    .join("\n");

  const text = [
    `New order placed on StyleRoute — ${order.orderNumber}`,
    "",
    lines,
    "",
    `Subtotal: ${money(order.subtotal)}`,
    `Shipping: ${order.shipping === 0 ? "Free" : money(order.shipping)}`,
    `Total: ${money(order.total)}`,
    "",
    `Customer: ${order.customer.name}`,
    `Phone: ${order.customer.phone}`,
    `Address: ${order.customer.address}, ${order.customer.city}, ${order.customer.state} - ${order.customer.pincode}`,
    "",
    "Payment: Cash on Delivery (confirm via WhatsApp)",
  ].join("\n");

  try {
    await transporter.sendMail({
      from: `"StyleRoute" <${process.env.EMAIL_USER}>`,
      to: SUPPORT_EMAIL,
      subject: `New order ${order.orderNumber} — ${money(order.total)}`,
      text,
    });
  } catch (error) {
    console.error("Order notification email failed:", error);
  }
}
