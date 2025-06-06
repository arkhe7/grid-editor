import React from 'react';
import { Group, Rect, Text, Image as KonvaImage } from 'react-konva';
import useImage from 'use-image';
import { GridSlot, User } from '../types';

interface GridSlotProps {
  slot: GridSlot;
  isSelected: boolean;
  onClick: () => void;
  onDoubleClick: () => void;
  onUpdate: (updates: Partial<GridSlot>) => void;
  onRemoveUser: () => void;
}

interface ProfileImageProps {
  user: User;
  width: number;
  height: number;
  borderRadius: number;
}

const ProfileImage: React.FC<ProfileImageProps> = ({ user, width, height, borderRadius }) => {
  const imageUrl = user.profile_image_url.replace('_normal', '_400x400');
  const [image] = useImage(imageUrl, 'anonymous');
  const [fallbackImage] = useImage(user.profile_image_url, 'anonymous');
  
  const displayImage = image || fallbackImage;

  if (!displayImage) {
    return (
      <Rect
        width={width}
        height={height}
        fill="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        cornerRadius={borderRadius}
      />
    );
  }

  return (
    <KonvaImage
      image={displayImage}
      width={width}
      height={height}
      cornerRadius={borderRadius}
    />
  );
};

const GridSlotComponent: React.FC<GridSlotProps> = ({
  slot,
  isSelected,
  onClick,
  onDoubleClick,
  onUpdate,
  onRemoveUser
}) => {

  // Simple click handler based on Konva docs
  const handleClick = (e: any) => {
    console.log('✅ GridSlot clicked:', slot.id);
    e.cancelBubble = true; // Stop event propagation
    onClick();
  };

  const handleDoubleClick = (e: any) => {
    console.log('✅ GridSlot double-clicked:', slot.id);
    e.cancelBubble = true;
    onDoubleClick();
  };

  const handleRemoveClick = (e: any) => {
    console.log('✅ Remove clicked for:', slot.id);
    e.cancelBubble = true;
    onRemoveUser();
  };

  if (!slot.user) {
    // Empty slot - render clickable area
    return (
      <Group
        x={slot.x}
        y={slot.y}
        rotation={slot.rotation}
        scaleX={slot.scale}
        scaleY={slot.scale}
        onClick={handleClick} // Olay yöneticisini Group'a taşı
        onDblClick={handleDoubleClick} // Olay yöneticisini Group'a taşı
        onTouchStart={handleClick} // Olay yöneticisini Group'a taşı
      >
        {/* Hit detection area for the entire slot including "Add Profile" text */}
        <Rect
          width={slot.width}
          height={slot.height + 40} // "Add Profile" metnini kapsayacak kadar yükseklik
          fill="transparent" // Tıklama alanı için görünmez yap
        />

        {/* Visual background */}
        <Rect
          width={slot.width}
          height={slot.height}
          fill={slot.backgroundColor}
          stroke={isSelected ? '#2ed573' : slot.borderColor}
          strokeWidth={isSelected ? 3 : slot.borderWidth}
          dash={[10, 5]}
          cornerRadius={slot.borderRadius}
          opacity={slot.opacity}
          shadowBlur={slot.shadowBlur}
          shadowColor={slot.shadowColor}
          shadowOffsetX={slot.shadowOffsetX}
          shadowOffsetY={slot.shadowOffsetY}
          listening={false} // Bu görsel eleman olayları dinlememeli
        />
        
        {/* Plus icon */}
        <Text
          text="+"
          fontSize={slot.width * 0.4} // İkonu biraz daha belirgin yapalım
          fill="rgba(255, 255, 255, 0.4)"
          width={slot.width}
          height={slot.height}
          align="center"
          verticalAlign="middle"
          listening={false} 
        />
        
        {/* "Add Profile" text has been removed as per user request */}
      </Group>
    );
  }

  // Filled slot with user
  const textY = slot.textPosition === 'top' 
    ? -30 
    : slot.textPosition === 'bottom' 
    ? slot.height + 10
    : slot.textPosition === 'center'
    ? slot.height / 2
    : slot.height - 30;

  return (
    <Group
      x={slot.x}
      y={slot.y}
      rotation={slot.rotation}
      scaleX={slot.scale}
      scaleY={slot.scale}
    >
      {/* Background overlay - clickable */}
      <Rect
        width={slot.width}
        height={slot.height}
        fill="rgba(0, 0, 0, 0.1)"
        cornerRadius={slot.borderRadius}
        onClick={handleClick}
        onDblClick={handleDoubleClick}
        onTouchStart={handleClick}
      />

      {/* Profile Image */}
      <ProfileImage
        user={slot.user}
        width={slot.width}
        height={slot.height}
        borderRadius={slot.borderRadius}
      />

      {/* Border - clickable */}
      <Rect
        width={slot.width}
        height={slot.height}
        stroke={isSelected ? '#2ed573' : slot.borderColor}
        strokeWidth={isSelected ? 3 : slot.borderWidth}
        cornerRadius={slot.borderRadius}
        fill="transparent"
        onClick={handleClick}
        onDblClick={handleDoubleClick}
        onTouchStart={handleClick}
      />

      {/* Username Text - clickable */}
      <Text
        text={`@${slot.user.screen_name}`}
        fontSize={Math.max(6, slot.width / 10)} // Değişiklik: Font boyutu küçültüldü
        fill={slot.textColor}
        fontStyle="bold"
        width={slot.width} // Metin genişliği slot genişliği kadar
        align="center"
        x={0} // Slot içine ortala
        y={slot.height + 16} // Değişiklik: Slot ile metin arası boşluk 2 katına çıkarıldı
        padding={2} // Metin etrafına biraz padding
        ellipsis={true} // Uzun isimler için ...
        shadowBlur={1}
        shadowColor="rgba(0, 0, 0, 0.7)"
        onClick={handleClick}
        onDblClick={handleDoubleClick}
        onTouchStart={handleClick}
      />

      {/* Followers count if enabled */}
      {slot.showFollowers && (
        <Text
          text={`${slot.user.followers_count.toLocaleString()} followers`}
          fontSize={slot.textSize * 0.8}
          fill={slot.textColor}
          width={slot.width + 40}
          align="center"
          x={-20}
          y={textY + slot.textSize + 5}
          shadowBlur={2}
          shadowColor="rgba(0, 0, 0, 0.8)"
          onClick={handleClick}
          onDblClick={handleDoubleClick}
          onTouchStart={handleClick}
        />
      )}

      {/* Description if enabled */}
      {slot.showDescription && slot.user.description && (
        <Text
          text={slot.user.description.substring(0, 50) + '...'}
          fontSize={slot.textSize * 0.7}
          fill={slot.textColor}
          width={slot.width + 40}
          align="center"
          x={-20}
          y={textY + slot.textSize + (slot.showFollowers ? 25 : 15)}
          shadowBlur={2}
          shadowColor="rgba(0, 0, 0, 0.8)"
          onClick={handleClick}
          onDblClick={handleDoubleClick}
          onTouchStart={handleClick}
        />
      )}

      {/* Remove button (visible when selected) */}
      {isSelected && (
        <Group>
          <Rect
            width={30}
            height={30}
            fill="#ff4757"
            cornerRadius={15}
            x={slot.width - 35}
            y={5}
            onClick={handleRemoveClick}
            onTouchStart={handleRemoveClick}
          />
          <Text
            text="×"
            fontSize={20}
            fill="white"
            fontStyle="bold"
            width={30}
            height={30}
            align="center"
            verticalAlign="middle"
            x={slot.width - 35}
            y={5}
            onClick={handleRemoveClick}
            onTouchStart={handleRemoveClick}
          />
        </Group>
      )}
    </Group>
  );
};

export default GridSlotComponent;
