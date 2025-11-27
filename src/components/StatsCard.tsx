import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

interface StatsCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon?: React.ReactNode;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, subtitle, icon }) => {
    return (
        <Card sx={{ minWidth: 250, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                        {title}
                    </Typography>
                    {icon && <Box sx={{ color: 'text.secondary' }}>{icon}</Box>}
                </Box>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                    {value}
                </Typography>
                {subtitle && (
                    <Typography variant="caption" color="text.secondary">
                        {subtitle}
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
};

export default StatsCard;
