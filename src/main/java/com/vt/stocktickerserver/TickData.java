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

    private String symbol;
    private double high;
    private  double low;
    private  long ts;

    public TickData(String symbol, double high, double low, long ts) {
        this.symbol = symbol;
        this.high = high;
        this.low = low;
        this.ts = ts;
    }

    public String getSymbol() {
        return symbol;
    }
    public double getHigh() {
        return high;
    }

    public double getLow() {
        return low;
    }

    public long getTs() {
        return ts;
    }
}
