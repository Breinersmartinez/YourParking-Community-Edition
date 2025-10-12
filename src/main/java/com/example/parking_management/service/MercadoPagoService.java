package com.example.parking_management.service;

import com.example.parking_management.dto.paymentsDTO.BacksUrlDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;


import com.mercadopago.MercadoPagoConfig;
import com.mercadopago.client.preference.PreferenceBackUrlsRequest;
import com.mercadopago.client.preference.PreferenceClient;
import com.mercadopago.client.preference.PreferenceItemRequest;
import com.mercadopago.client.preference.PreferenceRequest;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import com.mercadopago.resources.preference.Preference;

@Service
public class MercadoPagoService {

    @Value("${meli.accesToken}")
    private String accedToken;

    private String urlMeli = "https://api.mercadopago.com/v1/payments/";

    private String createPreference(String title, Integer quantity, String currencyId, BigDecimal unitPrice,
                                    BacksUrlDTO backsUrl, String notificationUrl) throws MPException, MPApiException {


    }

}
