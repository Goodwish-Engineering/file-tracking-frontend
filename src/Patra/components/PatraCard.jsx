import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Box,
  Button,
  Avatar,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Person as PersonIcon,
  Business as BusinessIcon,
  CalendarToday as CalendarIcon,
  PriorityHigh as PriorityIcon,
  AttachFile as AttachFileIcon,
  Reply as ReplyIcon,
  Forward as ForwardIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';

const PatraCard = ({ 
  patra, 
  onRead, 
  onReply, 
  onForward, 
  onClick,
  showActions = true 
}) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      default: return 'default';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ne-NP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateText = (text, maxLength = 150) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <Card 
      sx={{ 
        mb: 2,
        cursor: onClick ? 'pointer' : 'default',
        backgroundColor: patra.is_read ? 'background.paper' : 'action.hover',
        '&:hover': {
          boxShadow: 3,
          transform: 'translateY(-2px)'
        },
        transition: 'all 0.2s ease-in-out'
      }}
      onClick={onClick}
    >
      <CardContent>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
              <PersonIcon />
            </Avatar>
            <Box>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  fontWeight: patra.is_read ? 'normal' : 'bold',
                  color: 'text.primary'
                }}
              >
                {patra.sender_name || 'अज्ञात पठाउने'}
              </Typography>
              {patra.sender_department && (
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                  <BusinessIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                  <Typography variant="caption" color="text.secondary">
                    {patra.sender_department}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {patra.priority && patra.priority !== 'normal' && (
              <Chip
                size="small"
                label={patra.priority}
                color={getPriorityColor(patra.priority)}
                icon={<PriorityIcon />}
              />
            )}
            <Chip
              size="small"
              label={formatDate(patra.created_at)}
              icon={<CalendarIcon />}
              variant="outlined"
            />
            {showActions && (
              <IconButton size="small">
                <MoreVertIcon />
              </IconButton>
            )}
          </Box>
        </Box>

        {/* Subject */}
        <Typography 
          variant="h6" 
          sx={{ 
            mb: 1,
            fontWeight: patra.is_read ? 'normal' : 'bold',
            color: 'text.primary'
          }}
        >
          {patra.subject}
        </Typography>

        {/* Content Preview */}
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ mb: 2 }}
        >
          {truncateText(patra.content_preview || patra.content)}
        </Typography>

        {/* Metadata */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          {patra.attachment_count > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AttachFileIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                {patra.attachment_count} संलग्नक
              </Typography>
            </Box>
          )}
          
          {patra.file_reference && (
            <Chip
              size="small"
              label={`फाइल: ${patra.file_reference}`}
              variant="outlined"
              sx={{ fontSize: '0.75rem' }}
            />
          )}

          {!patra.is_read && (
            <Chip
              size="small"
              label="नयाँ"
              color="primary"
              sx={{ fontSize: '0.75rem' }}
            />
          )}
        </Box>
      </CardContent>

      {showActions && (
        <CardActions sx={{ pt: 0 }}>
          <Button 
            size="small" 
            startIcon={<ReplyIcon />}
            onClick={(e) => {
              e.stopPropagation();
              onReply?.(patra);
            }}
          >
            जवाफ दिनुहोस्
          </Button>
          <Button 
            size="small" 
            startIcon={<ForwardIcon />}
            onClick={(e) => {
              e.stopPropagation();
              onForward?.(patra);
            }}
          >
            फर्वार्ड गर्नुहोस्
          </Button>
          {!patra.is_read && (
            <Button 
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onRead?.(patra);
              }}
            >
              पढिएको चिन्ह लगाउनुहोस्
            </Button>
          )}
        </CardActions>
      )}
    </Card>
  );
};

export default PatraCard;
