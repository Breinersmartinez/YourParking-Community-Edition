package com.example.parking_management.model.space;

import com.example.parking_management.audit.Auditable;

public class Space extends Auditable<Space> {

    private Integer spaceId;

    private int spaceNumber;

    private String spaceType;

    private String state;

    private String dimesions;
}
