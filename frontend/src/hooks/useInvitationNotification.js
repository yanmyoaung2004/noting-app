import { useEffect } from "react";
import SockJS from "sockjs-client/dist/sockjs.min.js";
import { Client } from "@stomp/stompjs";

const useInvitationNotifications = (
  token,
  onInvite,
  onDelete,
  onPermissionUpdate,
  onUpdateRejectUpdate
) => {
  useEffect(() => {
    if (!token) return;

    const socket = new SockJS(
      `http://localhost:8000/ws-notifications?token=${token}`
    );
    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log("Connected to the server");
        client.subscribe("/user/queue/invitations", (message) => {
          const body = JSON.parse(message.body);
          if (body.status === "INVITE") {
            if (onInvite) onInvite(body.notification);
          } else if (body.status === "DELETE") {
            const { status, ...rest } = body;
            if (onDelete) onDelete(rest);
          } else if (body.status === "UPDATE_PERMISSION") {
            const { status, ...rest } = body;
            if (onPermissionUpdate) onPermissionUpdate(rest);
          } else if (body.status === "UPDATE_REJECT") {
            const { status, ...rest } = body;
            console.log(rest);
            if (onUpdateRejectUpdate) onUpdateRejectUpdate(rest);
          }
        });
      },
      onStompError: (frame) => {
        console.error("STOMP error:", frame);
      },
      onWebSocketError: (error) => {
        console.error("WebSocket error:", error);
      },
    });

    client.activate();

    return () => {
      client.deactivate();
    };
  }, [token]);

  return null;
};

export default useInvitationNotifications;
