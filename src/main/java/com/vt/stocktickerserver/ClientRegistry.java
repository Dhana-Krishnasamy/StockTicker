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

import java.util.Collections;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.ConcurrentHashMap;
import javax.websocket.Session;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 * @author Dhana
 */
//@Singleton
public class ClientRegistry {

    private final static Logger l = LoggerFactory.getLogger(ClientRegistry.class.getSimpleName());
    private final ConcurrentHashMap<Session, List<String>> sessions = new ConcurrentHashMap<>();

    public void listenFor(String tick, Session session) {
        sessions.putIfAbsent(session, Collections.synchronizedList(new LinkedList<String>()));
        sessions.get(session).add(tick);
        l.info("added session for tick {}", tick);
    }

    public void removeListenerFor(String tick, Session session) {
        sessions.get(session).remove(tick);
        l.info("removed tick {}", tick);
    }

    public void removeListener(Session session) {
        sessions.remove(session);
        l.info("removed session {}", session);
    }

    public void publishData(String tick, Object data) {
        if (sessions.isEmpty()) {
            l.trace("no clients found");
            return;
        }
        l.info("found {} clients ", sessions.size());
        for (Map.Entry<Session, List<String>> entrySet : sessions.entrySet()) {
            Session client = entrySet.getKey();
            List<String> ticks = entrySet.getValue();
            if (ticks.contains(tick)) {
                client.getAsyncRemote().sendText(data.toString());
                l.trace("publishing data for tick {}", tick);
            }

        }
    }

    private static ClientRegistry _instance;

    static ClientRegistry getBean() {
        return _instance;
    }

    static void setBean(ClientRegistry bean) {
        _instance = Objects.requireNonNull(bean, "Null bean");
    }

}
