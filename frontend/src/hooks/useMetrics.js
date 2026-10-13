import { useState, useEffect, useRef } from 'react';
import { useWebSocket } from './useWebSocket';

/**
 * useMetrics - processes raw WebSocket data from the backend into
 * a clean, component-ready format. All field name mapping happens here.
 *
 * Backend sends:
 *   metrics.bandwidth_mbps, metrics.latency_ms, metrics.packet_loss_percent,
 *   metrics.jitter_ms, metrics.buffer_seconds, metrics.quality,
 *   metrics.network_status, metrics.is_simulated
 *
 * We expose normalized objects with snake_case preserved for transparency.
 */
export function useMetrics() {
  const { data, connected } = useWebSocket();
  const [metricsHistory, setMetricsHistory] = useState([]);
  const timeRef = useRef(0);

  useEffect(() => {
    if (data?.metrics) {
      timeRef.current += 1;
      setMetricsHistory(prev => {
        const point = {
          // Keep original fields for table/log display
          ...data.metrics,
          // Add chart-friendly aliases
          bandwidth:   data.metrics.bandwidth_mbps,
          latency:     data.metrics.latency_ms,
          packetLoss:  data.metrics.packet_loss_percent,
          jitter:      data.metrics.jitter_ms,
          buffer:      data.metrics.buffer_seconds,
          quality:     data.metrics.quality,
          // Time index for chart x-axis
          time:        timeRef.current,
          label:       new Date().toLocaleTimeString(),
        };
        const newHistory = [...prev, point];
        // Keep last 120 points (~2 minutes at 1s interval)
        if (newHistory.length > 120) return newHistory.slice(newHistory.length - 120);
        return newHistory;
      });
    }
  }, [data]);

  // Extract and normalize stream status
  const rawStream = data?.stream_status || {};
  const rawBuffer = data?.buffer_status || {};

  return {
    // Raw network metrics with normalized field names
    metrics: {
      bandwidth_mbps:        data?.metrics?.bandwidth_mbps        ?? 0,
      latency_ms:            data?.metrics?.latency_ms            ?? 0,
      packet_loss_percent:   data?.metrics?.packet_loss_percent   ?? 0,
      jitter_ms:             data?.metrics?.jitter_ms             ?? 0,
      buffer_seconds:        data?.metrics?.buffer_seconds        ?? 10,
      quality:               data?.metrics?.quality               ?? '1080p',
      network_status:        data?.metrics?.network_status        ?? 'excellent',
      is_simulated:          data?.metrics?.is_simulated          ?? true,
    },

    // Stream / playback status
    streamStatus: {
      mode:               rawStream.mode               ?? 'adaptive',
      current_quality:    rawStream.current_quality    ?? '1080p',
      current_bitrate_mbps: rawStream.current_bitrate_mbps ?? 5.0,
      buffer_seconds:     rawStream.buffer_seconds     ?? 10,
      is_buffering:       rawStream.is_buffering       ?? false,
      playback_status:    rawStream.playback_status    ?? 'playing',
    },

    // Buffer status
    bufferStatus: {
      buffer_seconds:         rawBuffer.buffer_seconds         ?? 10,
      is_buffering:           rawBuffer.is_buffering           ?? false,
      buffering_events_count: rawBuffer.buffering_events_count ?? 0,
      buffer_state:           rawBuffer.buffer_state           ?? 'SAFE',
    },

    // Health and stability scores (0-100)
    scores: {
      network_health:      data?.scores?.network_health      ?? 100,
      quality_stability:   data?.scores?.quality_stability   ?? 100,
    },

    // Recent alert events
    alerts: data?.alerts ?? [],

    // Historical time-series data for charts (last 120 points)
    metricsHistory,

    // WebSocket connection status
    connected,
  };
}
