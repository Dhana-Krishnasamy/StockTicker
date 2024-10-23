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

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.LinkedList;
import java.util.List;
import java.util.Objects;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

import javax.websocket.Session;

/**
 * @author Dhana
 */
//@Singleton
public class ClientRegistry {

    private final static Logger l = LoggerFactory.getLogger(ClientRegistry.class.getSimpleName());
    private final ConcurrentHashMap<String, CopyOnWriteArrayList<Session>> tickToSessionMap = new ConcurrentHashMap<>();

    public void listenFor(String tick, Session session) {
        tickToSessionMap.putIfAbsent(tick, new CopyOnWriteArrayList<>());
        tickToSessionMap.get(tick).add(session);
        l.info("added session for tick {}", tick);
    }

    public void removeListenerFor(String tick, Session session) {
        tickToSessionMap.get(tick).remove(session);
        l.info("removed tick {}", tick);
    }

    public void removeListener(Session session) {
        tickToSessionMap.values().forEach(l -> l.remove(session));
        l.info("removed session {}", session);
    }

    public void publishData(String tick, Object data) {
        if (tickToSessionMap.isEmpty() || tickToSessionMap.get(tick) == null) {
            l.trace("no clients found");
            return;
        }
        //l.info("found {} symbols ", tickToSessionMap.size());
        String dataString = data.toString();
        tickToSessionMap.get(tick).forEach(session -> {
            session.getAsyncRemote().sendText(dataString);
        });

    }

    private static ClientRegistry _instance;

    static ClientRegistry getBean() {
        return _instance;
    }

    static void setBean(ClientRegistry bean) {
        _instance = Objects.requireNonNull(bean, "Null bean");
    }

}
