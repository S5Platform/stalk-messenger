//
//  Socket.swift
//  ReactSockets
//
//  Created by Henry Kirkness on 10/05/2015.
//  Copyright (c) 2015 Facebook. All rights reserved.
//

import Foundation

@objc(SocketIO)
class SocketIO: RCTEventEmitter {
  var socket: SocketIOClient!
  var connectionSocket: URL!
  var socketConfig: SocketIOClientConfiguration!
  
  // Event list for Handling RCTEvent
  override func supportedEvents() -> [String]! {
    return ["socketEvent"]
  }
  
  /**
   * Initialize and configure socket
   */
  
  @objc func initialize(_ connection: String, config: [String:AnyObject]) -> Void {
    connectionSocket = URL(string: connection);
    
    socketConfig = [.log(false)];
    
    for ( key, value) in config {
      var option: Any?;
      
      switch key {
        case "connectParams" :
          option = SocketIOClientOption.connectParams( value as! [String : Any] );
        case "doubleEncodeUTF8" :
          option = SocketIOClientOption.doubleEncodeUTF8( value as! Bool );
        case "extraHeaders" :
          option = SocketIOClientOption.extraHeaders( value as! [String: String] );
        case "forcePolling" :
          option = SocketIOClientOption.forcePolling( value as! Bool );
        case "forceNew" :
          option = SocketIOClientOption.forceNew( value as! Bool );
        case "forceWebsockets" :
          option = SocketIOClientOption.forceWebsockets( value as! Bool );
        case "log" :
          option = SocketIOClientOption.log( value as! Bool );
        case "nsp" :
          option = SocketIOClientOption.nsp( value as! String );
        case "path" :
          option = SocketIOClientOption.path( value as! String );
        case "reconnects" :
          option = SocketIOClientOption.reconnects( value as! Bool );
        case "reconnectAttempts" :
          option = SocketIOClientOption.reconnectAttempts( value as! Int );
        case "reconnectWait" :
          option = SocketIOClientOption.reconnectWait( value as! Int );
        case "secure" :
          option = SocketIOClientOption.secure( value as! Bool );
        case "selfSigned" :
          option = SocketIOClientOption.selfSigned( value as! Bool );
        case "voipEnabled" :
          option = SocketIOClientOption.voipEnabled( value as! Bool );
        default:
          option = nil;
      }
      
      if( option != nil ){
        socketConfig.insert(option as! SocketIOClientOption );
      }
    }
    
    // Connect to socket with config
    self.socket = SocketIOClient(
      socketURL: self.connectionSocket!,
      config:socketConfig
    )
    
    // Initialize onAny events
    self.onAnyEvent()
  }
  
  /**
   * Manually join the namespace
   */
  
  @objc func joinNamespace(_ namespace: String)  -> Void {
    self.socket.joinNamespace(namespace);
  }
  
  /**
   * Leave namespace back to '/'
   */
  
  @objc func leaveNamespace() {
    self.socket.leaveNamespace();
  }
  
  /**
   * Exposed but not currently used
   * add NSDictionary of handler events
   */
  
  @objc func addHandlers(_ handlers: NSDictionary) -> Void {
    for handler in handlers {
      self.socket.on(handler.key as! String) { data, ack in
        self.sendEvent(
          withName: "socketEvent", body: handler.key);
      }
    }
  }
  
  /**
   * Emit event to server
   */
  
  @objc func emit(_ event: String, items: AnyObject) -> Void {
    self.socket.emit(event, items as! SocketData)
  }
  
  /**
   * PRIVATE: handler called on any event
   */
  
  func onAnyEventHandler (sock: SocketAnyEvent) -> Void {
    if let items = sock.items {
      self.sendEvent(withName: "socketEvent", body: ["name": sock.event, "items": items])
    } else {
      self.sendEvent(withName: "socketEvent", body: ["name": sock.event])
    }
  }
  
  /**
   * Trigger the event above on any event
   * Currently adding handlers to event on the JS layer
   */
  
  func onAnyEvent() -> Void {
    self.socket.onAny(self.onAnyEventHandler)
  }
  
  // Connect to socket
  @objc func connect() -> Void {
    self.socket.connect()
  }
  
  // Disconnect to socket
  @objc func disconnect() -> Void {
    self.socket.disconnect()
  }
  
  // Reconnect to socket
  @objc func reconnect() -> Void {
    self.socket.reconnect()
  }
}
