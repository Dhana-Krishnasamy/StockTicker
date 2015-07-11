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

import java.util.LinkedList;
import java.util.List;

/**
 *
 * @author Dhana
 */
public class TickData {

    private String tick;
    private List<Tick> ticks;

    public TickData(String tick) {
        this.tick = tick;
        ticks = new LinkedList<>();
    }

    public String getTick() {
        return tick;
    }

    public void setTick(String tick) {
        this.tick = tick;
    }

    public List<Tick> getTicks() {
        return ticks;
    }

    public void setTicks(List<Tick> ticks) {
        this.ticks = ticks;
    }

}
