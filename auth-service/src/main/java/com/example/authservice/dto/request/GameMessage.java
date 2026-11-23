package com.example.authservice.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GameMessage {
    private String type;
    private String roomId;
    private String playerName;
    private String symbol;
    private Integer position;
    private String[] board;
    private String currentTurn;
    private String winner;
    private int[] winningLine;
    private String message;
    private String playerX;
    private String playerO;
}
