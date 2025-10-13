// components/tasks/BidsSection.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const BidsSection = ({ bids, onViewBid }) => {
  const [selectedBids, setSelectedBids] = useState([]);

  const isAccepted = (bidId) => selectedBids.includes(bidId);

  return (
    <View style={{
      backgroundColor: '#ffffff',
      borderRadius: 20,
      padding: 20,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 5
    }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Text style={{
          fontSize: 18,
          fontWeight: '700',
          color: '#1f2937'
        }}>
          Bids Received ({bids.length})
        </Text>
        <Text style={{
          fontSize: 14,
          color: '#6366F1',
          fontWeight: '600'
        }}>
          View All
        </Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20 }}>
        <View style={{ flexDirection: 'row', paddingHorizontal: 20, gap: 16 }}>
          {bids.map((bid) => (
            <View key={bid.id} style={{
              width: 300,
              borderRadius: 18,
              padding: 18,
              overflow: 'hidden',
              position: 'relative',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 8,
              elevation: 3,
              backgroundColor: isAccepted(bid.id) ? 'rgba(16, 185, 129, 0.05)' : '#ffffff',
              borderWidth: 2,
              borderColor: isAccepted(bid.id) ? 'rgba(16, 185, 129, 0.3)' : 'rgba(229, 231, 235, 0.8)'
            }}>
              {/* Status indicator */}
              {isAccepted(bid.id) && (
                <View style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderBottomLeftRadius: 12,
                  backgroundColor: '#10B981'
                }}>
                  <Text style={{ 
                    color: '#fff', 
                    fontSize: 10, 
                    fontWeight: '800',
                    textTransform: 'uppercase',
                    letterSpacing: 0.5
                  }}>
                    Accepted
                  </Text>
                </View>
              )}

              {/* Bid Header */}
              <View style={{ 
                flexDirection: 'row', 
                alignItems: 'center', 
                marginBottom: 14,
                paddingTop: isAccepted(bid.id) ? 10 : 0
              }}>
                <LinearGradient
                  colors={['#6366F1', '#3B82F6']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 14,
                    shadowColor: '#6366F1',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.2,
                    shadowRadius: 8,
                    elevation: 4
                  }}
                >
                  <Text style={{ 
                    fontSize: 18, 
                    fontWeight: '800', 
                    color: '#ffffff',
                    textTransform: 'uppercase'
                  }}>
                    {bid.seekerName.charAt(0)}
                  </Text>
                </LinearGradient>
                
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={{ 
                    fontSize: 16, 
                    fontWeight: '700', 
                    color: '#111827',
                    marginBottom: 2
                  }}>
                    {bid.seekerName}
                  </Text>
                  <Text style={{ 
                    fontSize: 13, 
                    color: '#6b7280', 
                    lineHeight: 18 
                  }}>
                    {bid.tagline}
                  </Text>
                </View>
                
                <View style={{ 
                  flexDirection: 'row', 
                  alignItems: 'center',
                  backgroundColor: 'rgba(245, 158, 11, 0.1)',
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: 'rgba(245, 158, 11, 0.2)'
                }}>
                  <Ionicons name="star" size={14} color="#F59E0B" />
                  <Text style={{ 
                    fontSize: 13, 
                    fontWeight: '700', 
                    color: '#92400E',
                    marginLeft: 4 
                  }}>
                    {bid.rating}
                  </Text>
                </View>
              </View>

              {/* Bid Details */}
              <View style={{ 
                backgroundColor: '#f8fafc',
                borderRadius: 12,
                padding: 12,
                marginBottom: 16,
                borderWidth: 1,
                borderColor: '#e2e8f0'
              }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                  <Text style={{ fontSize: 12, color: '#64748b', fontWeight: '600' }}>Bid Amount</Text>
                  <Text style={{ fontSize: 16, color: '#059669', fontWeight: '700' }}>{bid.bidAmount}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                  <Text style={{ fontSize: 12, color: '#64748b', fontWeight: '600' }}>Timeline</Text>
                  <Text style={{ fontSize: 14, color: '#1f2937', fontWeight: '600' }}>{bid.timeline}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: 12, color: '#64748b', fontWeight: '600' }}>Completed Tasks</Text>
                  <Text style={{ fontSize: 14, color: '#1f2937', fontWeight: '600' }}>{bid.completedTasks}</Text>
                </View>
              </View>

              {/* Single View Button */}
              <TouchableOpacity 
                onPress={() => onViewBid(bid)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#6366F1', '#4F46E5']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    paddingVertical: 14,
                    borderRadius: 12,
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    gap: 8,
                    shadowColor: '#6366F1',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 4
                  }}
                >
                  <Ionicons name="eye" size={18} color="#ffffff" />
                  <Text style={{ 
                    fontSize: 15, 
                    fontWeight: '600', 
                    color: '#ffffff'
                  }}>
                    View Bid Details
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default BidsSection;