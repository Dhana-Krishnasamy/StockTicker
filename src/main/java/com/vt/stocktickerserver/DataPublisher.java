/*© Copyright Vasantham Technologies Limited 2015
 /*-----------------------------------------------
 * This file and the source code contained herein are the property of Vasantham Technologies Limited 
 * and are protected by English copyright law. All usage is restricted as per 
 * the terms & conditions of Vasantham Technologies Limited. You may not alter or remove 
 * any trademark, copyright or other notice from copies of the content.

 * The code contained herein may not be reproduced, copied, modified or redistributed in any form
 * without the express written consent by an officer of Vasantham Technologies Limited.
 */
package com.vt.stocktickerserver;

import java.io.IOException;
import java.io.StringWriter;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import org.codehaus.jackson.map.ObjectMapper;

/**
 *
 * @author Dhana
 */
public class DataPublisher {

    ObjectMapper mapper = new ObjectMapper();
    SimpleDateFormat ft = new SimpleDateFormat("hh:mm:ss.SSS");
    Map<String, Float> lastPxs = new HashMap<>();
    long startTime;

    public DataPublisher() throws ParseException {
        SimpleDateFormat ft1 = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
        Date parse = ft1.parse("2010-10-11 08:10:00");
        startTime = parse.getTime();
    }

    public void publishTick() throws IOException {
        startTime += 500;
        ClientRegistry.getBean().publishData("msft", getTickData("msft", 21, 0.07f));
        ClientRegistry.getBean().publishData("vod.l", getTickData("vod.l", 37, 0.13f));
        ClientRegistry.getBean().publishData("ubs.l", getTickData("ubs.l", 67, 0.31f));
    }

    private StringWriter getTickData(String tick, float px, float factor) throws IOException {
        TickData td = new TickData(tick);
        float lastPx = px;
        if (lastPxs.containsKey(tick)) {
            lastPx = lastPxs.get(tick);
        }
        float delta = randNonZeroInt(-1, 1) * randNonZeroInt(-1, 1);
        float nextPx = Math.abs(lastPx + (delta * factor));
        lastPxs.put(tick, nextPx);
        td.getTicks().add(new Tick(ft.format(new Date(startTime)), nextPx));
        StringWriter wr = new StringWriter();
        mapper.writeValue(wr, td);
        return wr;
    }

    public static int randNonZeroInt(int min, int max) {
        Random rand = new Random();
        int randomNum = 0;
        int retry = 3;
        do {
            randomNum = rand.nextInt((max - min) + 1) + min;
            retry--;
        } while (randomNum == 0 && retry > 0);
        return randomNum;
    }
}
