/* © Copyright Vasantham Technologies Limited 2015
 /* -----------------------------------------------
 * This file and the source code contained herein are the property of Vasantham Technologies Limited 
 * and are protected by English copyright law. All usage is restricted as per 
 * the terms & conditions of Vasantham Technologies Limited. You may not alter or remove 
 * any trademark, copyright or other notice from copies of the content.
 
 * The code contained herein may not be reproduced, copied, modified or redistributed in any form
 * without the express written consent by an officer of Vasantham Technologies Limited.
 */
package com.vt.stocktickerserver;

/**
 *
 * @author Dhana
 */
import java.io.IOException;
import java.util.Map;
import java.util.logging.Level;
import javax.websocket.ClientEndpoint;
import javax.websocket.CloseReason;
import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;
import org.codehaus.jackson.map.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@ClientEndpoint
@ServerEndpoint(value = "/events/")
public class EventSocket {

    private final static Logger l = LoggerFactory.getLogger(EventSocket.class.getSimpleName());
    ObjectMapper mapper = new ObjectMapper();

    @OnOpen
    public void onWebSocketConnect(Session sess) {
        l.debug("Socket Connected: " + sess);
    }

    @OnMessage
    public void onWebSocketText(String message, Session session) {
        l.debug("Received TEXT message: " + message);
        Map readValue;
        try {
            readValue = mapper.readValue(message, Map.class);
            l.debug(readValue.toString());
            Object tick = readValue.get("tick");
            if (tick != null) {
                boolean register = Boolean.valueOf(readValue.get("register").toString());
                if (register) {
                    ClientRegistry.getBean().listenFor(tick.toString(), session);
                } else {
                    ClientRegistry.getBean().removeListenerFor(tick.toString(), session);
                }
            }
        } catch (IOException ex) {
            ClientRegistry.getBean().listenFor("msft", session);
            java.util.logging.Logger.getLogger(EventSocket.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    @OnClose
    public void onWebSocketClose(CloseReason reason, Session session) {
        l.debug("Socket Closed: " + reason);
        ClientRegistry.getBean().removeListener(session);
    }

    @OnError
    public void onWebSocketError(Throwable cause) {
        l.error("onWebSocketError", cause);

        //registery.removeListener(mySession);
    }
}
