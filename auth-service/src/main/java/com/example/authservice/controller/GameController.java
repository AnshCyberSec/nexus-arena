package com.example.authservice.controller;

import com.example.authservice.dto.request.GameMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Controller
public class GameController {

    private static final Logger log = LoggerFactory.getLogger(GameController.class);

    private static final int[][] LINES = {
            {0, 1, 2}, {3, 4, 5}, {6, 7, 8},
            {0, 3, 6}, {1, 4, 7}, {2, 5, 8},
            {0, 4, 8}, {2, 4, 6}
    };

    private final SimpMessagingTemplate messagingTemplate;

    private final Map<String, String[]> rooms = new ConcurrentHashMap<>();
    private final Map<String, String> turns = new ConcurrentHashMap<>();
    private final Map<String, String> playerX = new ConcurrentHashMap<>();
    private final Map<String, String> playerO = new ConcurrentHashMap<>();
    private final Set<String> finished = ConcurrentHashMap.newKeySet();

    public GameController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/game/{roomId}/join")
    public synchronized void joinGame(@DestinationVariable String roomId, @Payload GameMessage incoming) {
        log.info("[GAME] join room={} player={}", roomId, incoming.getPlayerName());

        String playerName = incoming.getPlayerName();
        GameMessage message = new GameMessage();
        message.setRoomId(roomId);
        message.setPlayerName(playerName);

        if (playerName == null || playerName.trim().isEmpty()) {
            message.setType("ERROR");
            message.setMessage("Player name is required!");
            send(roomId, message);
            return;
        }

        if (!playerX.containsKey(roomId)) {
            // Pehla player (room banane wala)
            playerX.put(roomId, playerName);
            rooms.put(roomId, new String[9]);
            turns.put(roomId, "X");

            message.setSymbol("X");
            message.setType("WAITING");
            message.setMessage("Waiting for Player 2...");
            message.setPlayerX(playerName);

        } else if (playerName.equals(playerX.get(roomId))) {
            // Player X ne dobara join kiya (refresh / reconnect)
            message.setSymbol("X");
            message.setPlayerX(playerX.get(roomId));
            message.setPlayerO(playerO.get(roomId));
            if (playerO.containsKey(roomId)) {
                message.setType("START");
                message.setMessage("Game Started!");
                message.setBoard(rooms.get(roomId).clone());
                message.setCurrentTurn(turns.get(roomId));
            } else {
                message.setType("WAITING");
                message.setMessage("Waiting for Player 2...");
            }

        } else if (!playerO.containsKey(roomId)) {
            // Dusra player
            playerO.put(roomId, playerName);

            message.setSymbol("O");
            message.setType("START");
            message.setMessage("Game Started!");
            message.setPlayerX(playerX.get(roomId));
            message.setPlayerO(playerName);
            message.setBoard(rooms.get(roomId).clone());
            message.setCurrentTurn(turns.get(roomId));

        } else if (playerName.equals(playerO.get(roomId))) {
            // Player O ne dobara join kiya
            message.setSymbol("O");
            message.setType("START");
            message.setMessage("Game Started!");
            message.setPlayerX(playerX.get(roomId));
            message.setPlayerO(playerO.get(roomId));
            message.setBoard(rooms.get(roomId).clone());
            message.setCurrentTurn(turns.get(roomId));

        } else {
            message.setType("ERROR");
            message.setMessage("Room is full!");
        }

        send(roomId, message);
    }

    @MessageMapping("/game/{roomId}/move")
    public synchronized void makeMove(@DestinationVariable String roomId, @Payload GameMessage incoming) {
        log.info("[GAME] move room={} player={} symbol={} pos={}",
                roomId, incoming.getPlayerName(), incoming.getSymbol(), incoming.getPosition());

        String[] board = rooms.get(roomId);
        if (board == null) return;

        // Dono players join hone chahiye aur game khatam nahi hona chahiye
        if (!playerO.containsKey(roomId) || finished.contains(roomId)) return;

        String currentTurn = turns.get(roomId);
        String symbol = incoming.getSymbol();
        String name = incoming.getPlayerName();
        Integer pos = incoming.getPosition();

        if (currentTurn == null || symbol == null || name == null || pos == null) return;
        if (!currentTurn.equals(symbol)) return; // Galat turn

        // Move bhejne wala asli player hona chahiye us symbol ka
        String expectedPlayer = symbol.equals("X") ? playerX.get(roomId) : playerO.get(roomId);
        if (!name.equals(expectedPlayer)) return;

        if (pos < 0 || pos > 8) return;
        if (board[pos] != null) return; // Box bhara hua hai

        board[pos] = symbol;

        GameMessage message = new GameMessage();
        message.setRoomId(roomId);
        message.setPlayerName(name);
        message.setSymbol(symbol);
        message.setPosition(pos);
        message.setPlayerX(playerX.get(roomId));
        message.setPlayerO(playerO.get(roomId));

        int[] winningLine = findWinningLine(board);

        if (winningLine != null) {
            finished.add(roomId);
            message.setWinner(symbol);
            message.setWinningLine(winningLine);
            message.setType("GAME_OVER");
        } else if (isBoardFull(board)) {
            finished.add(roomId);
            message.setType("GAME_OVER"); // Draw
        } else {
            turns.put(roomId, currentTurn.equals("X") ? "O" : "X");
            message.setType("MOVE");
        }

        message.setBoard(board.clone());
        message.setCurrentTurn(turns.get(roomId));

        send(roomId, message);
    }

    @MessageMapping("/game/{roomId}/reset")
    public synchronized void resetGame(@DestinationVariable String roomId) {
        log.info("[GAME] reset room={}", roomId);

        if (!rooms.containsKey(roomId)) return;

        rooms.put(roomId, new String[9]);
        turns.put(roomId, "X");
        finished.remove(roomId);

        GameMessage message = new GameMessage();
        message.setType("RESET");
        message.setRoomId(roomId);
        message.setBoard(rooms.get(roomId).clone());
        message.setCurrentTurn("X");
        message.setPlayerX(playerX.get(roomId));
        message.setPlayerO(playerO.get(roomId));
        message.setMessage("Game Reset! Player X's turn.");

        send(roomId, message);
    }

    private void send(String roomId, GameMessage message) {
        log.info("[GAME] broadcast room={} type={}", roomId, message.getType());
        messagingTemplate.convertAndSend("/topic/game/" + roomId, message);
    }

    private int[] findWinningLine(String[] board) {
        for (int[] line : LINES) {
            String a = board[line[0]];
            if (a != null && a.equals(board[line[1]]) && a.equals(board[line[2]])) {
                return line;
            }
        }
        return null;
    }

    private boolean isBoardFull(String[] board) {
        for (String s : board) {
            if (s == null) return false;
        }
        return true;
    }
}